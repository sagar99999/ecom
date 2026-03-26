import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip"
import BottomNav from "@/components/app/bottom-nav";
import TopNav from "@/components/app/top-nav";
import BottomInfo from "@/components/app/bottom-info";
import Navbar from "@/components/app/navbar";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs"
import { CartStoreProvider } from "@/stores/cart-store-provider";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Ecommerce",
  description: "GRAB Ecommerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CartStoreProvider>
        <body
          className={`${roboto.className} antialiased bg-black text-white`}
        >
          <ClerkProvider>
            <TooltipProvider>
              <NextTopLoader showSpinner={false} color="#aaff0d" height={2} />
              <TopNav />
              <Navbar />
              {children}
              <Toaster />
              <BottomInfo />
              <BottomNav />
            </TooltipProvider>
          </ClerkProvider>
        </body>
      </CartStoreProvider>
    </html>
  );
}
