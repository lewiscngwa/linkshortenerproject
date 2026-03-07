import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { shortLinks } from '@/db/schema';

export async function getLinksByUserId(
  userId: string,
): Promise<
  Array<{
    id: number;
    code: string;
    destinationUrl: string;
    ownerUserId: string;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  return db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.ownerUserId, userId))
    .orderBy(desc(shortLinks.updatedAt));
}

export async function createShortLink(data: {
  destinationUrl: string;
  code: string;
  ownerUserId: string;
}): Promise<{
  id: number;
  code: string;
  destinationUrl: string;
  ownerUserId: string;
  createdAt: Date;
  updatedAt: Date;
}> {
  const [result] = await db
    .insert(shortLinks)
    .values({
      destinationUrl: data.destinationUrl,
      code: data.code,
      ownerUserId: data.ownerUserId,
    })
    .returning();

  return result;
}

export async function checkCodeExists(code: string): Promise<boolean> {
  const [result] = await db
    .select({ id: shortLinks.id })
    .from(shortLinks)
    .where(eq(shortLinks.code, code))
    .limit(1);

  return !!result;
}

export async function getLinkById(
  id: number,
  userId: string,
): Promise<{
  id: number;
  code: string;
  destinationUrl: string;
  ownerUserId: string;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  const [result] = await db
    .select()
    .from(shortLinks)
    .where(eq(shortLinks.id, id))
    .limit(1);

  if (!result || result.ownerUserId !== userId) {
    return null;
  }

  return result;
}

export async function updateShortLink(
  id: number,
  userId: string,
  data: {
    destinationUrl: string;
    code: string;
  },
): Promise<{
  id: number;
  code: string;
  destinationUrl: string;
  ownerUserId: string;
  createdAt: Date;
  updatedAt: Date;
} | null> {
  // First verify ownership
  const existing = await getLinkById(id, userId);
  if (!existing) {
    return null;
  }

  const [result] = await db
    .update(shortLinks)
    .set({
      destinationUrl: data.destinationUrl,
      code: data.code,
    })
    .where(eq(shortLinks.id, id))
    .returning();

  return result;
}

export async function deleteShortLink(
  id: number,
  userId: string,
): Promise<boolean> {
  // First verify ownership
  const existing = await getLinkById(id, userId);
  if (!existing) {
    return false;
  }

  await db.delete(shortLinks).where(eq(shortLinks.id, id));
  return true;
}
