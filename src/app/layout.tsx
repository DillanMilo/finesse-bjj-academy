import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Cormorant_Garamond } from "next/font/google";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Finesse BJJ Academy | Premier Brazilian Jiu-Jitsu in Spring, TX",
    template: "%s | Finesse BJJ Academy",
  },
  description:
    "Master the art of finesse at Spring, TX's premier BJJ academy. Adult & Kids Brazilian Jiu-Jitsu, Wrestling, and more. Book your free 20-minute consultation.",
  keywords: [
    "BJJ",
    "Brazilian Jiu-Jitsu",
    "Spring TX",
    "martial arts",
    "wrestling",
    "self defense",
    "kids BJJ",
  ],
  openGraph: {
    title: "Finesse BJJ Academy | Premier Brazilian Jiu-Jitsu in Spring, TX",
    description:
      "Master the art of finesse at Spring, TX's premier BJJ academy. Book your free 20-minute consultation.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} ${cormorantGaramond.variable} dark`}
    >
      <body className="min-h-screen bg-background text-on-surface font-body antialiased">
        <div className="film-grain" />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
