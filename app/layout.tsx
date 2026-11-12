import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CEYTEQ | Business Enquiry",
  description: "Tell us about your business and discover digital growth solutions with CEYTEQ.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
