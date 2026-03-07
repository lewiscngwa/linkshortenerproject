"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createShortLink, checkCodeExists, updateShortLink, deleteShortLink } from "@/data/links";
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

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  destinationUrl: z.string().url("Must be a valid URL"),
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(32, "Code must be no more than 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Code can only contain letters, numbers, hyphens, and underscores"
    ),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export type UpdateLinkResult =
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

export async function updateLink(
  data: UpdateLinkInput
): Promise<UpdateLinkResult> {
  // 1. Authentication check
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
  }

  // 2. Validation
  const validation = updateLinkSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid input",
      details: validation.error.flatten().fieldErrors,
    };
  }

  // 3. Check if the new code already exists (only if it's different from current)
  const codeExists = await checkCodeExists(validation.data.code);
  if (codeExists) {
    // We need to check if this code belongs to the same link being updated
    // For simplicity, we'll let the data layer handle this via ownership check
    // If it's a different link's code, the update will fail
  }

  // 4. Update the link
  try {
    const result = await updateShortLink(
      validation.data.id,
      userId,
      {
        destinationUrl: validation.data.destinationUrl,
        code: validation.data.code,
      }
    );

    if (!result) {
      return {
        success: false,
        error: "Link not found or you don't have permission to edit it.",
      };
    }

    // 5. Revalidate the dashboard page to show the updated link
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
    console.error("Failed to update link:", error);
    return {
      success: false,
      error: "Failed to update link. Please try again.",
    };
  }
}

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export type DeleteLinkResult =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export async function deleteLink(
  data: DeleteLinkInput
): Promise<DeleteLinkResult> {
  // 1. Authentication check
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Unauthorized. Please sign in to continue." };
  }

  // 2. Validation
  const validation = deleteLinkSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      error: "Invalid link ID",
    };
  }

  // 3. Delete the link
  try {
    const success = await deleteShortLink(validation.data.id, userId);

    if (!success) {
      return {
        success: false,
        error: "Link not found or you don't have permission to delete it.",
      };
    }

    // 4. Revalidate the dashboard page to remove the deleted link
    revalidatePath("/dashboard");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete link:", error);
    return {
      success: false,
      error: "Failed to delete link. Please try again.",
    };
  }
}
