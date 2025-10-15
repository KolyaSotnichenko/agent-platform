import type { Metadata } from "next";
import "../globals.css";
import { Inter } from "next/font/google";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SidebarLayout } from "@/components/sidebar";
import { AuthProvider } from "@/providers/Auth";
// import { DOCS_LINK } from "@/constants";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  display: "swap",
});

export const metadata: Metadata = {
  title: "MHP Agent Platform",
  description: "MHP Agent Platform by LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const isBetaApp = process.env.NEXT_PUBLIC_BETA_APP === "true";
  return (
    <html lang="en">
      <head suppressHydrationWarning>
        {process.env.NODE_ENV !== "production" && (
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
        )}
      </head>
      <body className={inter.className}>
        {/* {isBetaApp && (
          <div className="fixed top-0 right-0 left-0 z-10 bg-[#CFC8FE] py-2 text-center text-black shadow-md">
            Використовуйте нашу бета-версію та допоможіть вдосконалити продукт разом з командою R&D!
            <a
              className="underline underline-offset-2"
              href={DOCS_LINK}
              target="_blank"
              rel="noopener noreferrer"
            >
              documentation
            </a>
          </div>
        )} */}
        <NuqsAdapter>
          <AuthProvider>
            <SidebarLayout>{children}</SidebarLayout>
          </AuthProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
