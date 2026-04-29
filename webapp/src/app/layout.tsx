import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/AppWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Affiliate AI Automation | Premium Suite",
  description: "Create premium affiliate videos with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <AppWrapper>
            {children}
        </AppWrapper>
      </body>
    </html>
  );
}
