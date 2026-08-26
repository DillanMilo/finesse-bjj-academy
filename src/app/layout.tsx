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
  metadataBase: new URL("https://finesse-bjj-academy.vercel.app"),
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
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Finesse BJJ Academy | Premier Brazilian Jiu-Jitsu in Spring, TX",
    description:
      "Master the art of finesse at Spring, TX's premier BJJ academy. Book your free 20-minute consultation.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "Finesse BJJ Academy Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Finesse BJJ Academy | Premier Brazilian Jiu-Jitsu in Spring, TX",
    description:
      "Master the art of finesse at Spring, TX's premier BJJ academy. Book your free 20-minute consultation.",
    images: ["/og-image.png"],
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
