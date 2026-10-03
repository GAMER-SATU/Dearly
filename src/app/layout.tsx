import type { Metadata } from "next";
import { Playfair_Display, Caveat, Plus_Jakarta_Sans, Alex_Brush } from "next/font/google";
import "./globals.css";

const scriptFont = Alex_Brush({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
  display: "swap",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const handwritingFont = Caveat({
  subsets: ["latin"],
  variable: "--font-handwriting",
  display: "swap",
});

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dearly — A Temporary Digital Memory Magazine",
  description:
    "A beautiful temporary digital magazine creator for sharing memories with someone through a single link.",
  icons: {
    icon: "/assets/stickers/heart-stamp.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${handwritingFont.variable} ${sansFont.variable} ${scriptFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-[#9e2a2b]/20 selection:text-[#5c1620]">
        {children}
      </body>
    </html>
  );
}
