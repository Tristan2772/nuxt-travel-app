import type { DrizzleError } from "drizzle-orm";

import db from "~~/lib/db";
import { InsertLocation, location } from "~~/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 5);

export default defineEventHandler(async (event) => {
  // if no user, then return with error
  if (!event.context.user) {
    return sendError(event, createError ({
      statusCode: 401,
      statusMessage: "Unauthorized Access",
    }));
  }

  // validate the form inputs
  const result = await readValidatedBody(event, InsertLocation.safeParse);
  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join("")}: ${issue.message}`).join("; ");

    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    return sendError(event, createError ({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }

  const existingLocation = await db.query.location.findFirst({
    where:
    and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),

    ),
  });
  if (existingLocation) {
    return sendError(event, createError ({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  // create a unique slug
  let slug = slugify(result.data.name);
  let existingSlug = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));

  while (existingSlug) {
    const id = nanoid();
    const newSlug = `${slug}-${id}`;
    existingSlug = !!(await db.query.location.findFirst({
      where: eq(location.slug, newSlug),
    }));
    if (!existingSlug) {
      slug = newSlug;
    }
  }

  // insert and return with validated data
  try {
    const [created] = await db.insert(location).values({
      ...result.data,
      slug: slugify(result.data.name),
      userId: event.context.user.id,
    }).returning();
    return created;
  }
  catch (e) {
    const error = e as DrizzleError;
    if (String(error.cause).includes("SQLITE_CONSTRAINT: SQLite error: UNIQUE constraint failed: location.slug")) {
      return sendError(event, createError ({
        statusCode: 409,
        statusMessage: "Slug must be unique (the location name is used to generate the slug)",
      }));
    }
    throw error;
  }
});
