import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const kaaryabSans = localFont({
  src: "./fonts/geist-sans.woff2",
  variable: "--font-kaaryab-sans",
  display: "swap",
});

const kaaryabMono = localFont({
  src: "./fonts/geist-mono.woff2",
  variable: "--font-kaaryab-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KaarYab Afghanistan",
  description: "Opportunity finder foundation for Afghan youth.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${kaaryabSans.variable} ${kaaryabMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-page text-primary">
        <Providers>
          <a href="#main-content" className="skip-to-content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
