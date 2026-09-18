export type Impression =
  | "banana-nomenal"
  | "pretty-sweet"
  | "not-bad"
  | "needs-a-tweak";

export type PhotoType = "banana" | "team";

export type LovedOption =
  | "The banana"
  | "The chocolate"
  | "The toppings"
  | "The crunch"
  | "The sweetness"
  | "The freshness"
  | "The staff"
  | "The presentation"
  | "The overall taste"
  | "The experience";

export const LOVED_OPTIONS: LovedOption[] = [
  "The banana",
  "The chocolate",
  "The toppings",
  "The crunch",
  "The sweetness",
  "The freshness",
  "The staff",
  "The presentation",
  "The overall taste",
  "The experience",
];

export type Review = {
  id?: string;
  impression: Impression;
  loved: LovedOption[];
  photoUrl?: string;
  photoType?: PhotoType;
  rating: number;
  comment?: string;
  createdAt?: Date | string;
  source?: "customer-review-app";
};

export type ReviewDraft = {
  impression: Impression | null;
  loved: LovedOption[];
  photoUrl?: string;
  photoType?: PhotoType;
  rating: number;
  comment: string;
};

export const emptyDraft: ReviewDraft = {
  impression: null,
  loved: [],
  photoUrl: undefined,
  photoType: undefined,
  rating: 0,
  comment: "",
};
