import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/lib/auth/Provider";
import TrpcProvider from "@/lib/trpc/Provider";
import { cookies } from "next/headers";
import { ConnectWalletProvider } from "@/components/wallet/WalletModalProvider";
import { PHProvider } from "@/lib/posthog/PosthogProvider";
import dynamic from "next/dynamic";
const PostHogPageView = dynamic(() => import("@/lib/posthog/PostHogPageView"), {
  ssr: false,
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soldrops",
  description: "Claim the latest and greatest airdrops on Solana",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#171717" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#171717" />
        <script
          defer
          data-domain="beta.soldrops.xyz"
          src="https://plausible.soldrops.xyz/js/script.js"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PHProvider>
            <NextAuthProvider>
              <TrpcProvider cookies={cookies().toString()}>
                <ConnectWalletProvider>
                  {children}
                  <PostHogPageView />
                </ConnectWalletProvider>
              </TrpcProvider>
            </NextAuthProvider>
            <Toaster richColors />
          </PHProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
