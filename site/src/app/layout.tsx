import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Doto, Instrument_Sans } from "next/font/google";
import { business, hours, SITE_URL } from "@/data/business";
import "./globals.css";

const shoulders = Big_Shoulders({ subsets: ["latin"], variable: "--font-shoulders", display: "swap" });
const doto = Doto({ subsets: ["latin"], variable: "--font-doto", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });

const title = "La Carnicería de Tomás · Carnicería en Ceuta · C/ Real, 40";
const description =
  "Carnicería en el centro de Ceuta: carnes naturales nacionales y de importación, elaborados artesanales y atención personalizada. Consulta el catálogo y pregunta por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: ["carnicería Ceuta", "carnicería calle Real Ceuta", "carne Ceuta", "La Carnicería de Tomás", "elaborados artesanales Ceuta"],
  openGraph: {
    title,
    description,
    type: "website",
    locale: "es_ES",
    siteName: business.name,
    images: [{ url: "/media/brand/og.jpg", width: 1200, height: 630, alt: business.name }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/media/brand/og.jpg"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#070708", colorScheme: "dark" };

const dayCodes = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ButcherShop",
  name: business.name,
  image: `${SITE_URL}/media/photos/fachada-nueva-1280.webp`,
  logo: `${SITE_URL}/media/brand/logo.png`,
  telephone: business.phone.e164,
  url: SITE_URL,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Calle Real, 40",
    postalCode: business.postalCode,
    addressLocality: "Ceuta",
    addressRegion: "Ceuta",
    addressCountry: "ES",
  },
  geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
  openingHoursSpecification: Object.entries(hours).flatMap(([d, slots]) =>
    slots.map(([opens, closes]) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: dayCodes[Number(d)], opens, closes })),
  ),
  sameAs: [business.instagram.url],
  hasMap: business.googleMaps,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${shoulders.variable} ${doto.variable} ${instrument.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('ct-intro-seen')==='1')d.classList.add('seen-intro')}catch(e){}" }} />
        <link rel="preload" as="image" href="/media/intro/poster-d.webp" media="(min-width: 768px)" />
        <link rel="preload" as="image" href="/media/intro/poster-m.webp" media="(max-width: 767px)" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
