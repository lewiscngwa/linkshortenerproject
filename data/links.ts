import { eq } from 'drizzle-orm';
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
    .where(eq(shortLinks.ownerUserId, userId));
}
