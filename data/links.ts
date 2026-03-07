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
