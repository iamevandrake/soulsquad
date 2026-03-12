import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SoulSquad - Your AI Marketing Agency",
  description:
    "Deploy an autonomous AI marketing team in minutes. Strategy, creative, growth, analytics. All running 24/7. Bring your own API keys.",
  openGraph: {
    title: "SoulSquad - Your AI Marketing Agency",
    description:
      "Deploy an autonomous AI marketing team in minutes. Bring your own API keys.",
    url: "https://soulsquad.ai",
    siteName: "SoulSquad",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SoulSquad - Your AI Marketing Agency",
    description:
      "Deploy an autonomous AI marketing team in minutes. Bring your own API keys.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-midnight-950 text-white">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
