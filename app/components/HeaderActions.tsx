"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import MobileMenu from "./MobileMenu";
import ThemeToggleClient from "./ThemeToggleClient";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggleClient />

        <SignedOut>
          <SignInButton mode="modal">
            <button className="h-10 rounded-full bg-foreground px-4 text-background">
              Sign in
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="h-10 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-4">
              Sign up
            </button>
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
        <div className="md:hidden">
          <UserButton />
        </div>
      </SignedIn>
    </div>
  );
}
