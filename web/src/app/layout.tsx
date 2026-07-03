import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/hooks/WalletProvider";
import { Header } from "@/components/Header";
import { DeployBanner } from "@/components/DeployBanner";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Packet Monsters";
const description =
  "Trading-card battler where every card is a real x402 API endpoint. Gotta cache 'em all.";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <div className="crt-vignette" />
        <div className="crt-scanlines" />
        <WalletProvider>
          <DeployBanner />
          <Header />
          <main className="flex-1">{children}</main>
        </WalletProvider>
      </body>
    </html>
  );
}
