import { pgTable, serial, varchar, text, timestamp } from "drizzle-orm/pg-core"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const feedback = pgTable("feedback", {
	id: serial().primaryKey(),
	type: varchar("type", { length: 20 }).notNull().default("other"),
	email: varchar("email", { length: 255 }),
	content: text("content").notNull(),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
