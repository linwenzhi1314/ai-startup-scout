import { pgTable, serial, timestamp, pgPolicy, varchar, text, index } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const feedback = pgTable("feedback", {
	id: serial().primaryKey().notNull(),
	type: varchar({ length: 20 }).default('other').notNull(),
	email: varchar({ length: 255 }),
	content: text().notNull(),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	pgPolicy("Service role can read feedback", { as: "permissive", for: "select", to: ["service_role"], using: sql`true` }),
	pgPolicy("Allow anonymous feedback submission", { as: "permissive", for: "insert", to: ["anon"] }),
]);

// 订阅表：存储用户订阅信息
export const subscribers = pgTable("subscribers", {
	id: serial().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
	tags: text("tags"), // JSON数组存储兴趣标签：["investor","founder"]
	isActive: text("is_active").default('true').notNull(), // 是否订阅（可取消）
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("subscribers_email_idx").on(table.email),
	index("subscribers_is_active_idx").on(table.isActive),
	pgPolicy("Service role can manage subscribers", { as: "permissive", for: "all", to: ["service_role"], using: sql`true` }),
	pgPolicy("Allow anonymous subscription", { as: "permissive", for: "insert", to: ["anon"] }),
]);
