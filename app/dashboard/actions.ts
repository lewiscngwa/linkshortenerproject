"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createShortLink, checkCodeExists } from "@/data/links";
import { revalidatePath } from "next/cache";

const createLinkSchema = z.object({
  destinationUrl: z.string().url("Must be a valid URL"),
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(32, "Code must be no more than 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Code can only contain letters, numbers, hyphens, and underscores"
    )
    .optional(),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

export type CreateLinkResult =
  | {
      success: true;
      data: {
        id: number;
        code: string;
        destinationUrl: string;
      };
    }
  | {
      success: false;
      error: string;
      details?: Record<string, string[]>;
    };

export async function createLink(
  data: CreateLinkInput
): Promise<CreateLinkResult> {
  // 1. Authentication check
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
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

  // 3. Generate a random code if not provided
  let code = validation.data.code;
  if (!code) {
    code = generateRandomCode();
  }

  // 4. Check if code already exists
  const codeExists = await checkCodeExists(code);
  if (codeExists) {
    return {
      success: false,
      error: "This code is already in use. Please choose a different one.",
    };
  }

  // 5. Create the short link
  try {
    const result = await createShortLink({
      destinationUrl: validation.data.destinationUrl,
      code,
      ownerUserId: userId,
    });

    // 6. Revalidate the dashboard page to show the new link
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        id: result.id,
        code: result.code,
        destinationUrl: result.destinationUrl,
      },
    };
  } catch (error) {
    console.error("Failed to create link:", error);
    return {
      success: false,
      error: "Failed to create link. Please try again.",
    };
  }
}

function generateRandomCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
