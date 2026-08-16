// A clean, bordered bar between the discipline tiles and the bio — a blue
// field with chartreuse flares glowing through it, both colors interspersed
// rather than a simple left-to-right blend. Pure decoration, no content.
export default function AccentBand() {
  return (
    <div
      aria-hidden
      className="relative h-24 w-full overflow-hidden border-y border-ink/10 bg-paper sm:h-32"
      style={{
        backgroundImage: [
          "radial-gradient(38% 70% at 12% 40%, rgba(200,255,61,0.85) 0%, rgba(200,255,61,0) 70%)",
          "radial-gradient(30% 60% at 38% 70%, rgba(200,255,61,0.7) 0%, rgba(200,255,61,0) 70%)",
          "radial-gradient(34% 65% at 62% 25%, rgba(200,255,61,0.6) 0%, rgba(200,255,61,0) 70%)",
          "radial-gradient(36% 70% at 85% 60%, rgba(200,255,61,0.75) 0%, rgba(200,255,61,0) 70%)",
          "linear-gradient(90deg, #38BDF8 0%, #7DD3FC 100%)",
        ].join(", "),
      }}
    />
  );
}
