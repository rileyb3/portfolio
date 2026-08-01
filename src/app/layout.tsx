import type { Metadata } from "next";
import { Manrope, Orbitron } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Bold, geometric sci-fi display face with strong circular letterforms —
// closest free match to the chunky futuristic logotype look (swapped in
// from Zen Dots, whose dot accents didn't show up much in this name).
// A licensed/custom font would match closer if you ever want to go
// further than what Google Fonts offers.
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-display",
});

const title = "Riley Byers — Portfolio";
const description =
  "Portfolio of Riley Byers — software, design, games, research, and writing.";

export const metadata: Metadata = {
  // TODO: swap in your real domain once you deploy (e.g. Vercel URL or
  // custom domain) so shared links resolve the OG image correctly.
  metadataBase: new URL("https://riley-byers-portfolio.vercel.app"),
  title,
  description,
  openGraph: {
    title,
    description,
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${orbitron.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
