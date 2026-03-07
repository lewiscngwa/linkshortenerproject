---
description: Read this file before creating or modifying any server actions or data mutations in the application. This document defines the project-wide patterns for server-side data mutations, validation, authentication checks, and database operations to ensure secure, consistent, and maintainable server-side code.
---

# Server Actions Instructions

## Purpose
This document defines the project-wide patterns and rules for implementing server actions and data mutations in this Next.js application. All contributors must follow these guidelines to ensure secure, consistent, and maintainable server-side code.

## Core Principles

### 1. Data Mutations via Server Actions Only
- **ALL data mutations** in this application MUST be performed via Next.js server actions
- Never perform data mutations directly from client components
- Never expose database operations directly to the client
- Server actions provide a secure, type-safe way to mutate data on the server

### 2. File Naming and Location
- Server action files **MUST** be named `actions.ts`
- Server action files **MUST** be colocated in the same directory as the component that calls them
- This pattern ensures clear separation of concerns and makes it easy to locate related server actions

**Example structure:**
```
app/
  dashboard/
    page.tsx
    actions.ts        # Server actions for dashboard page
  profile/
    page.tsx
    actions.ts        # Server actions for profile page
```

### 3. Server Action Directive
- All server action files MUST include the `"use server"` directive at the top of the file
- Individual functions can also use the `"use server"` directive if they are defined in shared files

**Example:**
```typescript
"use server";

// All functions in this file are server actions
export async function createLink(data: CreateLinkInput) {
  // implementation
}
```

## Authentication Requirements

### Authentication Check First
- **ALL server actions** MUST check for a logged-in user **before** proceeding with any database operations
- Use Clerk's `auth()` helper to get the current user
- Return an appropriate error response if the user is not authenticated
- Never proceed with mutations if authentication fails

**Example:**
```typescript
"use server";

import { auth } from "@clerk/nextjs/server";

export async function createLink(data: CreateLinkInput) {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      success: false,
      error: "Unauthorized. Please sign in to continue.",
    };
  }
  
  // Continue with validated operation...
}
```

## Type Safety and Validation

### TypeScript Types Required
- **ALL data** passed to server actions MUST have appropriate TypeScript types
- **DO NOT use the `FormData` TypeScript type** for server action parameters
- Define explicit interfaces or types for your server action inputs
- Use Zod schemas to derive TypeScript types when possible

**Example:**
```typescript
import { z } from "zod";

// Define Zod schema
const createLinkSchema = z.object({
  destinationUrl: z.string().url("Must be a valid URL"),
  code: z.string().min(3).max(20).optional(),
});

// Derive TypeScript type from Zod schema
type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(data: CreateLinkInput) {
  // implementation
}
```

### Server-Side Validation with Zod
- **ALL data** MUST be validated on the server using Zod
- Never trust client-side data without server-side validation
- Return descriptive validation errors to the client
- Validation should occur after authentication check but before database operations

**Example:**
```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

const createLinkSchema = z.object({
  destinationUrl: z.string().url("Must be a valid URL"),
  code: z.string().min(3).max(20).optional(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(data: CreateLinkInput) {
  // 1. Authentication check
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  // 2. Validation
  const validation = createLinkSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Database operation
  const result = await createShortLink({
    destinationUrl: validation.data.destinationUrl,
    code: validation.data.code,
    ownerUserId: userId,
  });

  return { success: true, data: result };
}
```

## Database Operations

### Use Helper Functions in /data Directory
- Server actions **MUST NOT** directly use Drizzle queries
- All database operations MUST be performed via helper functions
- Helper functions MUST be located in the `/data` directory
- This pattern provides a clear data access layer and improves testability

**Directory structure:**
```
data/
  links.ts          # Helper functions for links table
  users.ts          # Helper functions for users table
```

**Example helper function** (`/data/links.ts`):
```typescript
import { db } from '@/db';
import { shortLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createShortLink(data: {
  destinationUrl: string;
  code: string;
  ownerUserId: string;
}) {
  const [link] = await db
    .insert(shortLinks)
    .values({
      destinationUrl: data.destinationUrl,
      code: data.code,
      ownerUserId: data.ownerUserId,
    })
    .returning();
  
  return link;
}

export async function getLinksByUserId(userId: string) {
  return db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.ownerUserId, userId));
}
```

**Example server action using helper** (`app/dashboard/actions.ts`):
```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createShortLink } from "@/data/links";

const createLinkSchema = z.object({
  destinationUrl: z.string().url("Must be a valid URL"),
  code: z.string().min(3).max(20),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export async function createLink(data: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = createLinkSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const link = await createShortLink({
      ...validation.data,
      ownerUserId: userId,
    });

    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to create link:", error);
    return {
      success: false,
      error: "Failed to create link. Please try again.",
    };
  }
}
```

## Response Patterns

### Consistent Return Types
Server actions should return consistent response objects that indicate success or failure:

```typescript
// Success response
type SuccessResponse<T> = {
  success: true;
  data: T;
};

// Error response
type ErrorResponse = {
  success: false;
  error: string;
  details?: Record<string, string[]>; // For validation errors
};

// Combined type
type ActionResponse<T> = SuccessResponse<T> | ErrorResponse;
```

### Error Handling
- Always wrap database operations in try-catch blocks
- Log errors on the server for debugging
- Return user-friendly error messages to the client
- Never expose sensitive error details (e.g., database errors) to the client

```typescript
try {
  const result = await someDbHelper(data);
  return { success: true, data: result };
} catch (error) {
  console.error("Operation failed:", error);
  return {
    success: false,
    error: "An unexpected error occurred. Please try again.",
  };
}
```

## Client Component Integration

### Calling Server Actions from Client Components
- Server actions are called from client components (marked with `"use client"`)
- Use React's `useTransition` or `useActionState` for better UX
- Handle loading states and errors appropriately

**Example:**
```typescript
"use client";

import { useState, useTransition } from "react";
import { createLink } from "./actions";

export function CreateLinkForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      destinationUrl: formData.get("url") as string,
      code: formData.get("code") as string,
    };

    startTransition(async () => {
      const result = await createLink(data);
      
      if (!result.success) {
        setError(result.error);
      } else {
        // Handle success (e.g., redirect, show toast)
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Link"}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

## Complete Example

Here's a complete example following all the patterns:

**`/data/links.ts` (Database helpers):**
```typescript
import { db } from '@/db';
import { shortLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createShortLink(data: {
  destinationUrl: string;
  code: string;
  ownerUserId: string;
}) {
  const [link] = await db
    .insert(shortLinks)
    .values(data)
    .returning();
  
  return link;
}

export async function updateShortLink(
  linkId: number,
  userId: string,
  updates: { destinationUrl?: string; code?: string }
) {
  const [updated] = await db
    .update(shortLinks)
    .set({ ...updates, updatedAt: new Date() })
    .where(
      eq(shortLinks.id, linkId)
      .and(eq(shortLinks.ownerUserId, userId))
    )
    .returning();
  
  return updated;
}

export async function deleteShortLink(linkId: number, userId: string) {
  await db
    .delete(shortLinks)
    .where(
      eq(shortLinks.id, linkId)
      .and(eq(shortLinks.ownerUserId, userId))
    );
}
```

**`app/dashboard/actions.ts` (Server actions):**
```typescript
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import {
  createShortLink,
  updateShortLink,
  deleteShortLink,
} from "@/data/links";

// Schemas
const createLinkSchema = z.object({
  destinationUrl: z.string().url("Must be a valid URL"),
  code: z.string().min(3).max(20).regex(/^[a-zA-Z0-9-_]+$/),
});

const updateLinkSchema = z.object({
  linkId: z.number(),
  destinationUrl: z.string().url().optional(),
  code: z.string().min(3).max(20).regex(/^[a-zA-Z0-9-_]+$/).optional(),
});

// Types
type CreateLinkInput = z.infer<typeof createLinkSchema>;
type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

// Actions
export async function createLink(data: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = createLinkSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const link = await createShortLink({
      ...validation.data,
      ownerUserId: userId,
    });

    revalidatePath("/dashboard");
    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to create link:", error);
    return { success: false, error: "Failed to create link" };
  }
}

export async function updateLink(data: UpdateLinkInput) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  const validation = updateLinkSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const { linkId, ...updates } = validation.data;
    const link = await updateShortLink(linkId, userId, updates);

    if (!link) {
      return { success: false, error: "Link not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    return { success: true, data: link };
  } catch (error) {
    console.error("Failed to update link:", error);
    return { success: false, error: "Failed to update link" };
  }
}

export async function deleteLink(linkId: number) {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await deleteShortLink(linkId, userId);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return { success: false, error: "Failed to delete link" };
  }
}
```

**`app/dashboard/page.tsx` (Client component):**
```typescript
"use client";

import { useState, useTransition } from "react";
import { createLink, deleteLink } from "./actions";

export default function DashboardPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleCreateLink = async (formData: FormData) => {
    const data = {
      destinationUrl: formData.get("url") as string,
      code: formData.get("code") as string,
    };

    startTransition(async () => {
      const result = await createLink(data);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  const handleDeleteLink = async (linkId: number) => {
    startTransition(async () => {
      const result = await deleteLink(linkId);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <div>
      {/* UI implementation */}
    </div>
  );
}
```

## Checklist

Before submitting any server action code, ensure:

- [ ] Server action file is named `actions.ts`
- [ ] Server action file is colocated with the component that calls it
- [ ] File includes `"use server"` directive
- [ ] Authentication check is performed first using `auth()`
- [ ] Input data has explicit TypeScript types (not `FormData` type)
- [ ] Input data is validated using Zod schemas
- [ ] Database operations use helper functions from `/data` directory
- [ ] No direct Drizzle queries in server actions
- [ ] Consistent response pattern (success/error objects)
- [ ] Error handling with try-catch blocks
- [ ] User-friendly error messages returned to client
- [ ] Appropriate cache revalidation (e.g., `revalidatePath`)

## Additional Resources

- [Next.js Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Clerk Authentication in Server Actions](https://clerk.com/docs/references/nextjs/overview)
- [Zod Validation Library](https://zod.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
