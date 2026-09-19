import mongoose from "mongoose";

type Cached = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const g = globalThis as unknown as { _mongoose?: Cached };
const cached: Cached = g._mongoose ?? { conn: null, promise: null };
g._mongoose = cached;

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "banana_theory";
  if (!uri) throw new Error("MONGODB_URI is not set");
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      dbName,
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (err) {
    // If the first connect failed (bad URI, IP not allow-listed, etc.),
    // drop the cached rejected promise so the next request can retry.
    cached.promise = null;
    throw err;
  }
  return cached.conn;
}

const ReviewSchema = new mongoose.Schema(
  {
    impression: { type: String, required: true },
    loved: { type: [String], default: [] },
    photoUrl: { type: String },
    photoType: { type: String, enum: ["banana", "team"] },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    source: { type: String, default: "customer-review-app" },
    // simple dedupe key: rating+impression+comment+ip within a short window
    dedupeKey: { type: String, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ReviewModel =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);
