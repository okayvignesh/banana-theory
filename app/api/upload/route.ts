import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UPLOAD_URL = process.env.UPLOAD_API_URL;
const UPLOAD_TOKEN = process.env.UPLOAD_API_TOKEN;
const UPLOAD_PROJECT = process.env.UPLOAD_PROJECT_NAME || "banana-theory";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Proxy uploads to the oracle-uploadthing platform.
// Client posts multipart/form-data with a `file`; we forward with Bearer token so it never
// touches the browser. Response returns just the publicUrl we care about.
export async function POST(req: NextRequest) {
  if (!UPLOAD_URL || !UPLOAD_TOKEN) {
    return NextResponse.json(
      { error: "Upload service not configured" },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG, or WebP allowed" }, { status: 400 });
  }

  const outbound = new FormData();
  outbound.append("file", file, file.name);

  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPLOAD_TOKEN}`,
        "X-Project-Name": UPLOAD_PROJECT,
      },
      body: outbound,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("upload upstream fail", res.status, text);
      return NextResponse.json(
        { error: "Upload failed upstream" },
        { status: 502 }
      );
    }
    const data = (await res.json()) as {
      success: boolean;
      file?: { publicUrl?: string };
    };
    const url = data.file?.publicUrl;
    if (!url) {
      return NextResponse.json({ error: "Upload returned no URL" }, { status: 502 });
    }
    return NextResponse.json({ url });
  } catch (err) {
    console.error("upload proxy error", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 502 });
  }
}
