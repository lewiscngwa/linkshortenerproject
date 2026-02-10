import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

export const shortLinks = pgTable(
  'short_links',
  {
    id: integer('id').generatedAlwaysAsIdentity().primaryKey(),
    code: varchar('code', { length: 32 }).notNull(),
    destinationUrl: text('destination_url').notNull(),
    ownerUserId: text('owner_user_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex('short_links_code_unique').on(table.code),
    index('short_links_owner_user_id_idx').on(table.ownerUserId),
  ],
);
