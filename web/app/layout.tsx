import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Contract Analyzer",
  description:
    "Analyseer contracten met AI — vind risico's, clausules en aanbevelingen direct.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex min-h-screen flex-col bg-neutral-50 antialiased`}
      >
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
      </body>
    </html>
  );
}
