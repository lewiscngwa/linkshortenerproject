"use client";

import { Menu } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ThemeToggleClient from "./ThemeToggleClient";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-md hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] sm:w-[350px]">
        <nav className="flex flex-col gap-4 mt-8">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggleClient />
          </div>
          
          <div className="flex flex-col gap-3">
            <SignInButton mode="modal">
              <Button className="w-full rounded-full">Sign in</Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button variant="outline" className="w-full rounded-full">Sign up</Button>
            </SignUpButton>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
