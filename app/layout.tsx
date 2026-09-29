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
  title: {
    default: "Veyora — Technology for a Brighter Tomorrow",
    template: "%s | Veyora",
  },

  description:
    "Veyora designs and builds intelligent technology, digital experiences, data systems and learning pathways for businesses and people building a brighter tomorrow.",

  applicationName: "Veyora",

  keywords: [
    "Veyora",
    "AI automation",
    "AI agents",
    "software development",
    "digital products",
    "data analytics",
    "business intelligence",
    "cyber security",
    "AI creative",
    "Veyora Academy",
  ],

  openGraph: {
    title: "Veyora — Technology for a Brighter Tomorrow",
    description:
      "Intelligent technology, digital products, data systems, security and practical technology education.",
    siteName: "Veyora",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Veyora — Technology for a Brighter Tomorrow",
    description:
      "Intelligent technology, digital products, data systems, security and practical technology education.",
  },

  robots: {
    index: true,
    follow: true,
  },

  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
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