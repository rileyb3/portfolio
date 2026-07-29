import type { Metadata } from "next";
import { Manrope, Audiowide } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Bold, rounded, futuristic display face — closest free match to the
// chunky sci-fi logotype look. A licensed/custom font would match closer
// if you ever want to go further than what Google Fonts offers.
const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Riley Byers — Portfolio",
  description:
    "Portfolio of Riley Byers — software, design, games, research, and writing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${audiowide.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
