import type { Metadata } from "next";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "usePopcorn",
  description: "Search, rate, and track movies with usePopcorn.",
  openGraph: {
    title: "usePopcorn",
    description: "Search, rate, and track movies with usePopcorn.",
    siteName: "usePopcorn",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "usePopcorn",
    description: "Search, rate, and track movies with usePopcorn.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}