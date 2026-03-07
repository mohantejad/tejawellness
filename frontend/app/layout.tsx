import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import { Fraunces, DM_Sans } from "next/font/google";
import AuthBootstrap from "@/components/auth/AuthBootstrap";
import ReduxProvider from "@/components/ReduxProvider";
import ChatWidget from "@/components/ai/ChatWidget";


const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif" });
const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Teja Wellness — Skin & Hair Care Nutrition",
  description:
    "Discover the best ingredients, science-backed recipes, and curated products for radiant skin and healthy hair.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
