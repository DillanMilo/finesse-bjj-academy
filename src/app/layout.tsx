import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Cormorant_Garamond } from "next/font/google";
import Analytics from "@/components/analytics/Analytics";
import ClientLayout from "@/components/layout/ClientLayout";
import "./globals.css";
import { pageMetadata, staticPages, SITE_URL, SITE_NAME, IS_PRODUCTION } from "@/lib/seo";
import { CONTACT } from "@/lib/constants";

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

const home = staticPages[0];
export const metadata: Metadata = {
  ...pageMetadata(...home),
  metadataBase: new URL(SITE_URL),
  title: { default: `${home[1]} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  // Child layouts supply their own canonicals; dynamic detail pages override them.
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
  icons: { icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/icon-512.png", sizes: "512x512", type: "image/png" }], apple: "/apple-touch-icon.png" },
};

const businessGraph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "SportsActivityLocation", "@id": `${SITE_URL}/#academy`, name: SITE_NAME, url: SITE_URL,
      telephone: CONTACT.phone, email: CONTACT.email, logo: `${SITE_URL}/logo.png`, image: `${SITE_URL}/finesse-share-logo.png`,
      address: { "@type": "PostalAddress", streetAddress: "18300 Strack Dr, Suite 300", addressLocality: "Spring", addressRegion: "TX", postalCode: "77379", addressCountry: "US" },
      sameAs: ["https://www.instagram.com/finessejiujitsu/", "https://www.facebook.com/finessebjj", "https://www.youtube.com/@finessejiujitsuTX"] },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, publisher: { "@id": `${SITE_URL}/#academy` }, inLanguage: "en-US" },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessGraph).replace(/</g, "\\u003c") }} />
        <div className="film-grain" />
        <ClientLayout>{children}</ClientLayout>
        <Analytics production={IS_PRODUCTION} />
      </body>
    </html>
  );
}
