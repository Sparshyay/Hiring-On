import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HIRING-ON | Find Your Dream Job",
  description: "The modern platform connecting top talent with world-class companies.",
};

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import ConvexClientProvider from "@/components/ConvexClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ConvexClientProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ConvexClientProvider>
      </body>
    </html>
  );
}
