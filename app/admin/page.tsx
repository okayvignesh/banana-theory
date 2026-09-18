import { connectMongo, ReviewModel } from "@/lib/mongodb";
import { LOVED_OPTIONS } from "@/lib/review-types";
import { Star } from "lucide-react";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReviewDoc = {
  _id: string;
  impression: string;
  loved: string[];
  photoUrl?: string;
  photoType?: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

const IMPRESSION_LABELS: Record<string, string> = {
  "banana-nomenal": "Banana-nomenal",
  "pretty-sweet": "Pretty sweet",
  "not-bad": "Not bad",
  "needs-a-tweak": "Needs a tweak",
};

// Basic auth is enforced in middleware.ts

export default async function AdminPage() {
  await connectMongo();
  const reviews = (await ReviewModel.find()
    .sort({ createdAt: -1 })
    .limit(200)
    .lean()) as unknown as ReviewDoc[];

  const total = reviews.length;
  const avg =
    total === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / total;

  const dist = [1, 2, 3, 4, 5].map((n) => ({
    stars: n,
    count: reviews.filter((r) => r.rating === n).length,
  }));

  const impressionCounts = Object.keys(IMPRESSION_LABELS).map((k) => ({
    key: k,
    label: IMPRESSION_LABELS[k],
    count: reviews.filter((r) => r.impression === k).length,
  }));

  const lovedCounts = LOVED_OPTIONS.map((o) => ({
    label: o,
    count: reviews.filter((r) => r.loved?.includes(o)).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-dvh bg-cream text-chocolate p-6 md:p-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Banana Theory</h1>
            <p className="text-cocoa">Reviews dashboard</p>
          </div>
          <div className="text-sm text-cocoa">{total} reviews</div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Metric label="Total reviews" value={String(total)} />
          <Metric
            label="Average rating"
            value={avg.toFixed(2)}
            suffix={
              <span className="inline-flex items-center gap-0.5 text-star">
                <Star className="size-4 fill-current" strokeWidth={0} />
              </span>
            }
          />
          <Metric
            label="Photos submitted"
            value={String(reviews.filter((r) => r.photoUrl).length)}
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <Card title="Rating distribution">
            <div className="space-y-2">
              {dist
                .slice()
                .reverse()
                .map((d) => (
                  <div key={d.stars} className="flex items-center gap-3">
                    <div className="w-14 text-sm font-medium">
                      {d.stars} star{d.stars !== 1 ? "s" : ""}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-cream-dark overflow-hidden">
                      <div
                        className="h-full bg-banana"
                        style={{
                          width: total ? `${(d.count / total) * 100}%` : "0%",
                        }}
                      />
                    </div>
                    <div className="w-8 text-right text-sm text-cocoa">
                      {d.count}
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          <Card title="First impression">
            <div className="space-y-2">
              {impressionCounts.map((i) => (
                <div key={i.key} className="flex items-center gap-3">
                  <div className="w-32 text-sm font-medium">{i.label}</div>
                  <div className="flex-1 h-2 rounded-full bg-cream-dark overflow-hidden">
                    <div
                      className="h-full bg-chocolate-soft"
                      style={{
                        width: total ? `${(i.count / total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                  <div className="w-8 text-right text-sm text-cocoa">
                    {i.count}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <Card title="Most loved">
          <div className="flex flex-wrap gap-2">
            {lovedCounts
              .filter((l) => l.count > 0)
              .map((l) => (
                <span
                  key={l.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-3 py-1 text-sm"
                >
                  {l.label}
                  <span className="text-cocoa font-semibold">{l.count}</span>
                </span>
              ))}
            {lovedCounts.every((l) => l.count === 0) && (
              <span className="text-cocoa text-sm">No selections yet.</span>
            )}
          </div>
        </Card>

        <Card title="Recent reviews">
          {reviews.length === 0 ? (
            <p className="text-cocoa text-sm">No reviews yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {reviews.map((r) => (
                <li key={r._id.toString()} className="py-4 flex gap-4">
                  {r.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={r.photoUrl}
                      alt=""
                      className="size-16 rounded-lg object-cover shrink-0 border border-border"
                    />
                  ) : (
                    <div className="size-16 rounded-lg bg-cream-dark grid place-items-center text-cocoa text-xs shrink-0">
                      no photo
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="inline-flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={
                              "size-4 " +
                              (i < r.rating
                                ? "fill-star text-star"
                                : "text-border")
                            }
                            strokeWidth={0}
                          />
                        ))}
                      </div>
                      <span className="font-medium">
                        {IMPRESSION_LABELS[r.impression] ?? r.impression}
                      </span>
                      <span className="text-cocoa">
                        · {new Date(r.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {r.comment ? (
                      <p className="text-chocolate mt-1">{r.comment}</p>
                    ) : null}
                    {r.loved?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {r.loved.map((l) => (
                          <span
                            key={l}
                            className="text-xs bg-cream rounded-full px-2 py-0.5 border border-border"
                          >
                            {l}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white border border-border p-5">
      <div className="text-cocoa text-sm">{label}</div>
      <div className="mt-1 font-display text-3xl font-bold text-chocolate flex items-center gap-2">
        {value}
        {suffix}
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-white border border-border p-5">
      <h2 className="font-display text-lg font-bold text-chocolate mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
