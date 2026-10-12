import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Naveen Reddy Chirla · Business Analyst & Builder",
  description:
    "Business Analyst and MBA candidate in London. Shipping data products and full-stack apps — Jacked, Voyager AI, Applylytics, and more.",
  metadataBase: new URL("https://9chirla.github.io"),
  openGraph: {
    title: "Naveen Reddy Chirla",
    description: "Business Analyst & Builder · London",
    url: "https://9chirla.github.io",
    siteName: "Naveen Reddy Chirla",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#0a0a0a]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#0a0a0a] font-sans text-[#fafafa] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
