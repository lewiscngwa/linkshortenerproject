"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClerk, SignInButton, SignUpButton } from '@clerk/nextjs';
import { Button } from "@/components/ui/button";

export default function HomeClient(): JSX.Element {
  const params = useSearchParams();
  const clerk = useClerk();

  useEffect(() => {
    if (!clerk || !params) return;
    const modal = params.get('clerk_modal');
    if (modal === 'sign-in') clerk.openSignIn();
    if (modal === 'sign-up') clerk.openSignUp();
  }, [params, clerk]);

  return (
    <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
      <SignInButton mode="modal">
        <Button className="h-12 w-full rounded-full md:w-[158px]">
          Sign in
        </Button>
      </SignInButton>

      <SignUpButton mode="modal">
        <Button variant="outline" className="h-12 w-full rounded-full md:w-[158px]">
          Sign up
        </Button>
      </SignUpButton>
    </div>
  );
}
