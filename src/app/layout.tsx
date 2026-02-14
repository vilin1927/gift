import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "anna.norm.quest",
  description: "Кое-что для тебя",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#1a1612",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-bg-primary text-text-primary font-body min-h-dvh">
        {children}
      </body>
    </html>
  );
}
