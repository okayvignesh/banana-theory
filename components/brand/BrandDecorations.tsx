export function BrandDecorations() {
  return (
    <>
      <div
        className="bt-blob"
        style={{
          width: 260,
          height: 260,
          top: -80,
          right: -60,
          background: "var(--banana-yellow)",
        }}
        aria-hidden
      />
      <div
        className="bt-blob"
        style={{
          width: 220,
          height: 220,
          bottom: -100,
          left: -80,
          background: "var(--banana-cream-dark)",
          opacity: 0.9,
        }}
        aria-hidden
      />
    </>
  );
}
