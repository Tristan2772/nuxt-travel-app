import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { location } from "./location";

export const locationLog = sqliteTable("locationLog", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  startedAt: integer().notNull(),
  endedAt: integer().notNull(),
  description: text(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: integer().notNull().references(() => location.id),
  createdAt: integer().notNull().$default(() => Date.now()),
  updatedAt: integer().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});
