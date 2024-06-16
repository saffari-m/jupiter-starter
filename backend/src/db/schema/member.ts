import { pgTable, uuid, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 64 }),
  lastName: varchar('lastname', { length: 64 }),
  password: varchar('password', { length: 256 }).notNull(),
  mobile: varchar('mobile', { length: 11 }).notNull(),
  secret: varchar('secret', { length: 20 }).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect; //InferSelectModel<typeof users>;
export type NewUser = typeof users.$inferInsert; //InferInsertModel<typeof users>;
