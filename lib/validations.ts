import { z } from "zod";
import { LOVED_OPTIONS } from "./review-types";

const impressionEnum = z.enum([
  "banana-nomenal",
  "pretty-sweet",
  "not-bad",
  "needs-a-tweak",
]);

const lovedEnum = z.enum(LOVED_OPTIONS as [string, ...string[]]);

export const reviewSchema = z.object({
  impression: impressionEnum,
  loved: z.array(lovedEnum).max(20).default([]),
  photoUrl: z.string().url().optional(),
  photoType: z.enum(["banana", "team"]).optional(),
  rating: z.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v ? sanitize(v) : undefined)),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

function sanitize(input: string): string {
  // Strip C0/C1 control characters, collapse whitespace.
  const CONTROL = new RegExp("[\\u0000-\\u001F\\u007F-\\u009F]", "g");
  return input.replace(CONTROL, "").replace(/\s+/g, " ").trim();
}
