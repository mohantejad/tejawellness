import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Fraunces, Manrope } from "next/font/google";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import ReduxProvider from "@/components/ReduxProvider";
import ChatWidget from "@/components/ai/ChatWidget";


const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Teja Wellness",
  description: "An AI wellness guide for nutrition, beauty, and fitness",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ReduxProvider>
          <AuthBootstrap />
          <Header />
          <main className="container-page w-full">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
          <ChatWidget />
        </ReduxProvider>
      </body>
    </html>
  );
}
