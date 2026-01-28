"use client";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClerk, SignInButton, SignUpButton } from '@clerk/nextjs';

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
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]">
          Sign in
        </button>
      </SignInButton>

      <SignUpButton mode="modal">
        <button className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]">
          Sign up
        </button>
      </SignUpButton>
    </div>
  );
}
