import { pgTable, uuid, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }),
  lastName: varchar('lastname', { length: 50 }),
  password: varchar('password', { length: 100 }).notNull(),
  mobile: varchar('mobile', { length: 11 }).notNull(),
  secret: varchar('secret', { length: 50 }).notNull(),
  hasTwoFactor: boolean('hasTwoFactor').default(false).notNull(),
  createdAt: timestamp('createdAt').defaultNow().notNull(),
  updatedAt: timestamp('updatedAt')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect; //InferSelectModel<typeof users>;
export type NewUser = typeof users.$inferInsert; //InferInsertModel<typeof users>;
