import type { DrizzleError } from "drizzle-orm";

import defineAuthenticatedEventHandler from "~~/app/utils/define-authenticated-event-handler";
import { findLocationByName, findUniqueSlug, insertLocation } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";
import slugify from "slug";

export default defineAuthenticatedEventHandler(async (event) => {
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

  // make sure location name is available
  const existingLocation = await findLocationByName(result.data, event.context.user.id);
  if (existingLocation) {
    return sendError(event, createError ({
      statusCode: 409,
      statusMessage: "A location with that name already exists!",
    }));
  }

  // create a unique slug
  const slug = await findUniqueSlug(slugify(result.data.name));

  // insert and return with validated data
  try {
    return insertLocation(result.data, slug, event.context.user.id);
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
