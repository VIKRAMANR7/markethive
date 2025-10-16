import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/providers/modal-provider";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Barlow, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: {
    default: "MarketHive - Multi-Vendor Marketplace Platform",
    template: "%s | MarketHive",
  },
  description:
    "MarketHive is a next-generation multi-vendor marketplace connecting buyers and sellers worldwide. Discover unique products, competitive prices, and seamless shopping experience with real-time tracking, secure payments, and AI-powered recommendations.",
  applicationName: "MarketHive",
  metadataBase: new URL("https://markethive.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://markethive.com",
    siteName: "MarketHive",
    title: "MarketHive - Multi-Vendor Marketplace Platform",
    description: "Discover, buy, and sell on MarketHive...",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MarketHive Marketplace",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <head>
          {/* Mobile browser theme color */}
          <meta name="theme-color" content="#000000" />
        </head>
        <body className={`${inter.variable} ${barlow.variable}`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>

            <Toaster richColors position="bottom-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
