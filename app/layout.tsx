import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Gig Economy Tax Estimator",
  description: "Estimate quarterly taxes and generate income smoothing and expense deduction strategies for gig workers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col h-full">{children}</body>
    </html>
  );
}
