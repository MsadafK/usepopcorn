import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "usePopcorn",
  description: "Search, rate, and track movies with usePopcorn.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
