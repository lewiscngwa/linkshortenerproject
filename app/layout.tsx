import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Link2 } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import ThemeToggleClient from "./components/ThemeToggleClient";
import ClerkProviderWithTheme from "./components/ClerkProviderWithTheme";
import MobileMenu from "./components/MobileMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LinkShortener - Shorten Links, Track Performance, Grow Your Brand",
  description: "Create short, memorable links that make sharing easy. Track clicks, analyze your audience, and optimize your content strategy—all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProviderWithTheme>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <header className="flex items-center justify-between gap-4 p-3 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
              <Link2 className="h-6 w-6" />
              <span>LinkShortener</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <ThemeToggleClient />
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="h-10 rounded-full bg-foreground px-4 text-background">Sign in</button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="h-10 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-4">Sign up</button>
                  </SignUpButton>
                </SignedOut>

                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>

              <SignedOut>
                <MobileMenu />
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProviderWithTheme>
  );
}
