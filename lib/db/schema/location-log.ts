import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { user } from "./auth";
import { location } from "./location";

export const locationLog = sqliteTable("locationLog", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  startedAt: integer().notNull(),
  endedAt: integer().notNull(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  userId: integer().notNull().references(() => user.id),
  locationId: integer().notNull().references(() => location.id),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelations = relations(locationLog, ({ one }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
}));

export type SelectLocationLog = typeof locationLog.$inferSelect;
