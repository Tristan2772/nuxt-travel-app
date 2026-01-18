import type z from "zod";

import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

import type { SelectLocationLogImage } from "./location-log-img";

import { DescriptionSchema, LatSchema, LongSchema, NameSchema } from "../../zod-schemas";
import { user } from "./auth";
import { location } from "./location";
import { locationLogImg } from "./location-log-img";

export const locationLog = sqliteTable("locationLog", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  startedAt: int().notNull(),
  endedAt: int().notNull(),
  lat: real().notNull(),
  long: real().notNull(),
  locationId: int().notNull().references(() => location.id, { onDelete: "cascade" }),
  userId: int().notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: int().notNull().$default(() => Date.now()),
  updatedAt: int().notNull().$default(() => Date.now()).$onUpdate(() => Date.now()),
});

export const locationLogRelations = relations(locationLog, ({ one, many }) => ({
  location: one(location, {
    fields: [locationLog.locationId],
    references: [location.id],
  }),
  images: many(locationLogImg),
}));

const BaseInsertLocationLog = createInsertSchema(locationLog, {
  name: NameSchema,
  description: DescriptionSchema,
  lat: LatSchema,
  long: LongSchema,
});

const UnrefinedInsertLocationLog = BaseInsertLocationLog.omit({
  id: true,
  userId: true,
  locationId: true,
  createdAt: true,
  updatedAt: true,
});

export const InsertLocationLog = UnrefinedInsertLocationLog.superRefine((values, context) => {
  if (values.startedAt > values.endedAt || values.endedAt < values.startedAt) {
    context.addIssue({
      code: "custom",
      message: "Start date must be before end date!",
      path: ["startedAt"],
    });
    context.addIssue({
      code: "custom",
      message: "End date must be after start date!",
      path: ["endedAt"],
    });
  }
});

export type InsertLocationLog = z.infer<typeof InsertLocationLog>;
export type SelectLocationLog = typeof locationLog.$inferSelect;
export type SelectLocationLogWithImages = SelectLocationLog & {
  images: SelectLocationLogImage[];
};
