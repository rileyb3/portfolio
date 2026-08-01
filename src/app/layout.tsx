import type { Metadata } from "next";
import { Manrope, Zen_Dots } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Bold, geometric display face with a circular-dot motif — closest free
// match to the chunky sci-fi logotype look (swapped in from Audiowide).
// A licensed/custom font would match closer if you ever want to go
// further than what Google Fonts offers.
const zenDots = Zen_Dots({
  subsets: ["latin"],
  weight: "400",
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
    <html lang="en" className={`${manrope.variable} ${zenDots.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
