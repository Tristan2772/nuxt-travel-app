import db from "~~/lib/db";
import { InsertLocation } from "~~/lib/db/schema";
import { location } from "~~/lib/db/schema/location";

export default defineEventHandler(async (event) => {
  if (!event.context.user) {
    return sendError(event, createError ({
      statusCode: 401,
      statusMessage: "Unauthorized Access",
    }));
  }

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

  db.insert(location).values({
    ...result.data,
    slug: result.data.name.replaceAll(" ", "-").toLowerCase(),
    userId: 1,
  });

  return result.data;
});
