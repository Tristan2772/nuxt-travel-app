import { and, eq } from "drizzle-orm";

import type { InsertLocationLogImage } from "../schema";

import db from "..";
import { locationLogImg } from "../schema";

export async function insertLocationLogImage(
  locationLogId: number,
  insertable: InsertLocationLogImage,
  userId: number,
) {
  const [inserted] = await db.insert(locationLogImg).values({
    ...insertable,
    userId,
    locationLogId,
  }).returning();
  return inserted;
}

export async function deleteLocationLogImage(imageId: number, userId: number) {
  const [deleted] = await db.delete(locationLogImg).where(
    and(
      eq(locationLogImg.id, imageId),
      eq(locationLogImg.userId, userId),
    ),
  ).returning();

  return deleted;
}
