import type z from "zod";

import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import { user } from "./auth";
import { locationLog } from "./location-log";

export const locationLogImg = sqliteTable("locationLogImg", {
  id: integer().primaryKey({ autoIncrement: true }),
  key: text().notNull(),
  locationLogId: integer().notNull().references(() => locationLog.id, { onDelete: "cascade" }),
  userId: integer().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogImageRelations = relations(locationLogImg, ({ one, many }) => ({
  location: one(locationLog, {
    fields: [locationLogImg.locationLogId],
    references: [locationLog.id],
  }),
  image: many(locationLogImg),
}));

const BaseInsertLocationLogImage = createInsertSchema(locationLogImg, {
  key: field => field.regex(/^\d+\/\d+\/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.jpg$/, "Invalid Key"),
});
export const InsertLocationLogImage = BaseInsertLocationLogImage.omit({
  id: true,
  locationLogId: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLocationLogImage = z.infer<typeof InsertLocationLogImage>;
export type SelectLocationLogImage = typeof locationLogImg.$inferInsert;
