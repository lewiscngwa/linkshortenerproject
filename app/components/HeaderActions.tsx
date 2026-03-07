"use client";

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";
import ThemeToggleClient from "./ThemeToggleClient";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex items-center gap-3">
        <ThemeToggleClient />

        <SignedOut>
          <SignInButton mode="modal">
            <Button>Sign in</Button>
          </SignInButton>

          <SignUpButton mode="modal">
            <Button variant="outline">Sign up</Button>
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
