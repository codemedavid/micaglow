import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import "nprogress/nprogress.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/toaster";
import { ProgressBarProvider } from "@/components/progress-bar";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mama-mica.vercel.app'),
  title: {
    default: "Mama Mica - Premium Peptides Group Buy Platform",
    template: "%s | Mama Mica",
  },
  description: "Join our trusted community for exclusive access to pharmaceutical-grade peptides at wholesale prices through coordinated group purchases. Whitelist-only access.",
  keywords: ["peptides", "group buy", "pharmaceutical grade", "wholesale peptides", "peptide community"],
  authors: [{ name: "Mama Mica" }],
  creator: "Mama Mica",
  publisher: "Mama Mica",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mama-mica.vercel.app",
    title: "Mama Mica - Premium Peptides Group Buy",
    description: "Exclusive access to pharmaceutical-grade peptides at wholesale prices through coordinated group purchases.",
    siteName: "Mama Mica",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mama Mica - Premium Peptides Group Buy",
    description: "Exclusive access to pharmaceutical-grade peptides at wholesale prices.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add Google Search Console verification when ready
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProgressBarProvider>
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ProgressBarProvider>
        
        {/* Lead Connector Chat Widget */}
        <Script 
          src="https://widgets.leadconnectorhq.com/loader.js"
          data-resources-url="https://widgets.leadconnectorhq.com/chat-widget/loader.js"
          data-widget-id="68f559a649665e7db7885af9"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

