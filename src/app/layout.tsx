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
  metadataBase: new URL("https://theprobability.site"),

  title: {
    default: "The Probability | Prediction Markets",
    template: "%s | The Probability",
  },

  description:
    "Trade prediction markets on politics, sports, crypto, business, entertainment and world events. Forecast the future and earn from being right.",

  keywords: [
    "prediction markets",
    "prediction market",
    "forecasting",
    "forecast market",
    "event trading",
    "politics prediction",
    "sports prediction",
    "crypto prediction",
    "Kenya prediction market",
    "Africa prediction market",
    "The Probability",
  ],

  authors: [
    {
      name: "The Probability",
      url: "https://theprobability.site",
    },
  ],

  creator: "The Probability",

  publisher: "The Probability",

  category: "Finance",

  applicationName: "The Probability",

  alternates: {
    canonical: "https://theprobability.site",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    title: "The Probability | Prediction Markets",

    description:
      "Trade prediction markets on politics, sports, crypto, business, entertainment and world events.",

    url: "https://theprobability.site",

    siteName: "The Probability",

    locale: "en_US",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Probability",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "The Probability | Prediction Markets",

    description:
      "Forecast the future. Trade prediction markets. Earn from being right.",

    images: ["/og-image.png"],

    creator: "@Probability",
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
