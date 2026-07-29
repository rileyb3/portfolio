import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Full-site dark palette: black base, two surface levels for depth,
        // and a three-color hierarchy in priority order:
        // 1. chartreuse — the everyday accent, mainly hover states
        // 2. light blue — reserved for gradients/blends, not flat text
        // 3. orange — the CTA/button accent (Download CV, mailto)
        ink: "#0a0a0a", // page background
        surface: "#151515", // card background — one step up from ink
        surface2: "#1f1f1f", // hover / deeper card state
        paper: "#fafafa", // primary text (on dark)
        muted: "#a1a1aa", // secondary text
        accent: "#C8FF3D", // chartreuse — primary accent, mostly on hover
        accent2: "#7DD3FC", // light blue — gradients/blends only, not flat text
        accent3: "#FB923C", // orange — the CTA/button color
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "serif"], // name only
      },
    },
  },
  plugins: [],
};
export default config;
