// Same idea as before — a blue field with chartreuse flares glowing
// through it, colors interspersed rather than a simple blend — just
// re-oriented: flipped from a full-width horizontal band into a tall,
// narrow, pill-shaped strip (rounded-full softens both ends completely),
// so it can sit as a vertical accent right next to the Intro copy instead
// of splitting the page in two on its own. `self-stretch` inside Intro's
// flex row is what gives it its actual height — it matches whatever the
// adjacent text block renders at, rather than a fixed value here.
export default function AccentBand() {
  return (
    <div
      aria-hidden
      className="w-6 shrink-0 self-stretch overflow-hidden rounded-full border border-white/15 bg-ink sm:w-8"
      style={{
        backgroundImage: [
          "radial-gradient(70% 22% at 40% 12%, rgba(200,255,61,0.85) 0%, rgba(200,255,61,0) 70%)",
          "radial-gradient(60% 18% at 60% 38%, rgba(200,255,61,0.7) 0%, rgba(200,255,61,0) 70%)",
          "radial-gradient(65% 20% at 45% 62%, rgba(200,255,61,0.6) 0%, rgba(200,255,61,0) 70%)",
          "radial-gradient(70% 22% at 55% 85%, rgba(200,255,61,0.75) 0%, rgba(200,255,61,0) 70%)",
          "linear-gradient(180deg, #38BDF8 0%, #7DD3FC 100%)",
        ].join(", "),
      }}
    />
  );
}
