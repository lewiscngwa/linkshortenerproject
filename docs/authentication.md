++ begin
 # Authentication — Clerk (Repository Rules & Implementation)

 Purpose
 - Define the project-wide authentication rules and provide clear, minimal implementation patterns for using Clerk as the sole auth provider.

 Summary / Rules
 - Clerk is the only authentication provider allowed. Do not add other auth providers or custom auth flows.
 - The `/dashboard` route must be protected: only authenticated users may access it.
 - If an authenticated user visits `/` (the homepage), they must be redirected to `/dashboard`.
 - All sign-in and sign-up flows must launch via Clerk modals (never full-page redirects to sign-in pages).

 Quick Implementation Checklist
 - Install Clerk packages needed for Next.js App Router: `@clerk/nextjs` (follow Clerk docs for exact install command).
 - Wrap your root layout with `ClerkProvider` (see example for `app/layout.tsx`).
 - Protect `/dashboard` server-side using `currentUser()` or middleware; unauthenticated users must be sent to `/` with a query flag to trigger the modal.
 - Ensure the homepage client code opens Clerk's modal when the modal flag is present in the URL.
 - Use `SignInButton mode="modal"` and `SignUpButton mode="modal"` for UI buttons.

 Examples (App Router)

 1) Root layout (wrap with ClerkProvider)

 ```tsx
 // app/layout.tsx (example)
 import { ClerkProvider } from '@clerk/nextjs';

 export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
     <html lang="en">
       <body>
         <ClerkProvider>{children}</ClerkProvider>
       </body>
     </html>
   );
 }
```

 2) Protect `/dashboard` server-side (page-level guard)

 ```tsx
 // app/dashboard/page.tsx (server component)
 import { currentUser } from '@clerk/nextjs';
 import { redirect } from 'next/navigation';

 export default async function DashboardPage() {
   const user = await currentUser();
   if (!user) {
     // Send user back to homepage and ask homepage to open the sign-in modal
     redirect('/?clerk_modal=sign-in');
   }
   return <div>Protected dashboard for {user?.firstName ?? 'user'}</div>;
 }
```

 3) Middleware approach (optional, centralizes redirects)

 ```ts
 // middleware.ts
 import { NextResponse } from 'next/server';
 import type { NextRequest } from 'next/server';
 import { auth } from '@clerk/nextjs/server';

 export function middleware(req: NextRequest) {
   const { userId } = auth(req);
   const { pathname } = req.nextUrl;

   // Redirect signed-in users away from `/` to `/dashboard`
   if (pathname === '/' && userId) {
     return NextResponse.redirect(new URL('/dashboard', req.url));
   }

   // Protect dashboard path: forward unauthenticated users to `/` and flag modal
   if (pathname.startsWith('/dashboard') && !userId) {
     const url = req.nextUrl.clone();
     url.pathname = '/';
     url.searchParams.set('clerk_modal', 'sign-in');
     return NextResponse.redirect(url);
   }

   return NextResponse.next();
 }

 export const config = {
   matcher: ['/dashboard/:path*', '/'],
 };
```

 4) Homepage client — open modal when flagged

 ```tsx
 // app/page.tsx (client component or child client component)
 'use client';
 import { useEffect } from 'react';
 import { useSearchParams } from 'next/navigation';
 import { useClerk, SignInButton, SignUpButton } from '@clerk/nextjs';

 export default function HomeClient() {
   const params = useSearchParams();
   const clerk = useClerk();

   useEffect(() => {
     if (params.get('clerk_modal') === 'sign-in') {
       clerk.openSignIn();
     }
     if (params.get('clerk_modal') === 'sign-up') {
       clerk.openSignUp();
     }
   }, [params, clerk]);

   return (
     <div>
       <h1>Welcome</h1>
       <SignInButton mode="modal">Sign in</SignInButton>
       <SignUpButton mode="modal">Sign up</SignUpButton>
     </div>
   );
 }
```

 Notes & Rationale
 - Using both server-side checks (e.g., `currentUser()`) and middleware provides defense-in-depth: server components can't be rendered without auth, and middleware centralizes redirects and UX rules.
 - We avoid full-page Clerk sign-in routes so UX is consistent (modals only).
 - Flagging the homepage URL (e.g., `?clerk_modal=sign-in`) is a simple, observable contract between middleware/server guards and the client UI to open the modal.

 Testing
 - Start the dev server and confirm scenarios:
   - Unauthenticated: visit `/dashboard` → you should be redirected to `/?clerk_modal=sign-in` and the sign-in modal should open.
   - Authenticated: visit `/` → you should be redirected to `/dashboard`.
   - Clicking `Sign in` / `Sign up` uses modal flows.

 Security
 - Never expose Clerk API keys or secrets in the repo. Use `.env.local` and `process.env` for server-side keys per project conventions.

 Maintenance
 - If you change routing conventions, update these examples and the middleware matcher.
 - If Clerk changes SDK names/APIs, update the code samples and tests.

 Rationale (for agent authors)
 - Keep changes minimal and test locally. For any changes to auth flows or to add other auth providers, stop and request human approval.

++ end