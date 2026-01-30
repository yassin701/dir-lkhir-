import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth/user";
import { relations } from "drizzle-orm";

// Catégories des besoins
export enum NeedCategory {
  EDUCATION = "education",
  CLEANING = "cleaning",
  FINANCIAL = "financial",
  HEALTH = "health",
  FOOD = "food",
  OTHER = "other",
}

// Villes marocaines
export enum MoroccanCities {
  TANGIER = "tangier",
  TETOUAN = "tetouan",
  FEZ = "fez",
  MEKNES = "meknes",
  RABAT = "rabat",
  CASABLANCA = "casablanca",
  MARRAKECH = "marrakech",
  AGADIR = "agadir",
  ESSAOUIRA = "essaouira",
  LAAYOUNE = "laayoune",
}

export const needs = pgTable("needs", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  phoneWhatsApp: varchar("phone_whatsapp", { length: 20 }),
  volunteerCount: integer("volunteer_count").default(0).notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
}).enableRLS();

// Table de jonction pour les volontaires
export const needVolunteers = pgTable("need_volunteers", {
  id: text("id").primaryKey(),
  needId: text("need_id")
    .notNull()
    .references(() => needs.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}).enableRLS();

// Relations
export const needsRelations = relations(needs, ({ one, many }) => ({
  author: one(user, {
    fields: [needs.userId],
    references: [user.id],
  }),
  volunteers: many(needVolunteers),
}));

export const needVolunteersRelations = relations(
  needVolunteers,
  ({ one }) => ({
    need: one(needs, {
      fields: [needVolunteers.needId],
      references: [needs.id],
    }),
    volunteer: one(user, {
      fields: [needVolunteers.userId],
      references: [user.id],
    }),
  })
);

export const userNeedsRelations = relations(user, ({ many }) => ({
  needs: many(needs),
  volunteeredNeeds: many(needVolunteers),
}));

export type Need = typeof needs.$inferSelect;
export type NeedInsert = typeof needs.$inferInsert;
export type NeedVolunteer = typeof needVolunteers.$inferSelect;
export type NeedVolunteerInsert = typeof needVolunteers.$inferInsert;
