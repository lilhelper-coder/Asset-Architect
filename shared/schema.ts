import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull().$type<"gifter" | "senior">(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const seniorConfigs = pgTable("senior_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id),
  voiceSpeed: text("voice_speed").default("normal"),
  bioContext: text("bio_context"),
  deviceType: text("device_type"),
  gifterName: text("gifter_name"),
});

export const giftPools = pgTable("gift_pools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seniorId: varchar("senior_id").references(() => profiles.id),
  totalGoal: integer("total_goal").default(9900),
  currentRaised: integer("current_raised").default(0),
  magicLinkCode: varchar("magic_link_code").unique().notNull(),
  stripeSessionId: text("stripe_session_id"),
  organizerEmail: text("organizer_email"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contributors = pgTable("contributors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  poolId: varchar("pool_id").notNull().references(() => giftPools.id),
  name: text("name").notNull(),
  amountPledged: integer("amount_pledged").notNull(),
  email: text("email"),
  paidAt: timestamp("paid_at"),
});

export const mirrorSessions = pgTable("mirror_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  seniorId: varchar("senior_id").references(() => profiles.id),
  helperId: varchar("helper_id"),
  active: boolean("active").default(true),
  sessionUuid: varchar("session_uuid").unique().notNull(),
  lastHeartbeat: timestamp("last_heartbeat").defaultNow(),
  transcript: jsonb("transcript").$type<Array<{ role: string; text: string; timestamp: string }>>(),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  seniorConfig: one(seniorConfigs, {
    fields: [profiles.id],
    references: [seniorConfigs.profileId],
  }),
}));

export const seniorConfigsRelations = relations(seniorConfigs, ({ one }) => ({
  profile: one(profiles, {
    fields: [seniorConfigs.profileId],
    references: [profiles.id],
  }),
}));

export const giftPoolsRelations = relations(giftPools, ({ one, many }) => ({
  senior: one(profiles, {
    fields: [giftPools.seniorId],
    references: [profiles.id],
  }),
  contributors: many(contributors),
}));

export const contributorsRelations = relations(contributors, ({ one }) => ({
  pool: one(giftPools, {
    fields: [contributors.poolId],
    references: [giftPools.id],
  }),
}));

export const mirrorSessionsRelations = relations(mirrorSessions, ({ one }) => ({
  senior: one(profiles, {
    fields: [mirrorSessions.seniorId],
    references: [profiles.id],
  }),
}));

// @ts-ignore - drizzle-zod version compatibility
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true });
// @ts-ignore - drizzle-zod version compatibility
export const insertSeniorConfigSchema = createInsertSchema(seniorConfigs).omit({ id: true });
// @ts-ignore - drizzle-zod version compatibility
export const insertGiftPoolSchema = createInsertSchema(giftPools).omit({ id: true, createdAt: true });
// @ts-ignore - drizzle-zod version compatibility
export const insertContributorSchema = createInsertSchema(contributors).omit({ id: true });
// @ts-ignore - drizzle-zod version compatibility
export const insertMirrorSessionSchema = createInsertSchema(mirrorSessions).omit({ id: true, lastHeartbeat: true });

export type InsertProfile = any; // z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertSeniorConfig = any; // z.infer<typeof insertSeniorConfigSchema>;
export type SeniorConfig = typeof seniorConfigs.$inferSelect;
export type InsertGiftPool = any; // z.infer<typeof insertGiftPoolSchema>;
export type GiftPool = typeof giftPools.$inferSelect;
export type InsertContributor = any; // z.infer<typeof insertContributorSchema>;
export type Contributor = typeof contributors.$inferSelect;
export type InsertMirrorSession = any; // z.infer<typeof insertMirrorSessionSchema>;
export type MirrorSession = typeof mirrorSessions.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// @ts-ignore - drizzle-zod version compatibility
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = any; // z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
