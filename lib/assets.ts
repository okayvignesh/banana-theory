export const bananaAssets = {
  logo: "/assets/banana-theory/logo.png",
  hero: "/assets/banana-theory/hero-banana.png",
  thankYou: "/assets/banana-theory/thank-you.png",
  chocolateNut: "/assets/banana-theory/product-chocolate-nut.png",
  whiteChocolate: "/assets/banana-theory/product-white-chocolate.png",
  oreo: "/assets/banana-theory/product-oreo.png",
  bananaBunch: "/assets/banana-theory/banana-bunch.png",
  chocolate: "/assets/banana-theory/chocolate.png",
  toppings: "/assets/banana-theory/toppings.png",
  staff: "/assets/banana-theory/staff-selfie-placeholder.png",
  bananaSticker: "/assets/banana-theory/banana-sticker.png",
  decorativeChocolate: "/assets/banana-theory/decorative-chocolate.png",
  background: "/assets/banana-theory/app-background.png",
  // reactions
  reactionLove: "/assets/banana-theory/reaction-love.png",
  reactionSweet: "/assets/banana-theory/reaction-sweet.png",
  reactionOk: "/assets/banana-theory/reaction-ok.png",
  reactionMeh: "/assets/banana-theory/reaction-meh.png",
} as const;

export type BananaAssetKey = keyof typeof bananaAssets;
