import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { connectMongo, ReviewModel } from "@/lib/mongodb";
import { reviewSchema } from "@/lib/validations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// naïve in-memory rate limit: 10 posts / 60s per IP
// ponytail: process-local, single-instance; swap for Upstash Ratelimit if we scale to >1 lambda
const bucket = new Map<string, number[]>();
const RATE_LIMIT = 10;
const WINDOW_MS = 60_000;

function rateLimited(ip: string) {
  const now = Date.now();
  const arr = (bucket.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  bucket.set(ip, arr);
  return arr.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "0.0.0.0";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // Dedupe within 30s: same IP + same rating + impression + hashed comment.
  const dedupeKey = createHash("sha256")
    .update(
      [
        ip,
        data.rating,
        data.impression,
        (data.comment ?? "").slice(0, 200),
      ].join("|")
    )
    .digest("hex");

  try {
    await connectMongo();

    const recent = await ReviewModel.findOne({
      dedupeKey,
      createdAt: { $gte: new Date(Date.now() - 30_000) },
    }).lean();

    if (recent) {
      return NextResponse.json({ ok: true, deduped: true }, { status: 200 });
    }

    const doc = await ReviewModel.create({
      ...data,
      dedupeKey,
    });

    return NextResponse.json({ ok: true, id: String(doc._id) }, { status: 201 });
  } catch (err) {
    console.error("review save error", err);
    return NextResponse.json(
      { error: "Could not save review" },
      { status: 500 }
    );
  }
}
