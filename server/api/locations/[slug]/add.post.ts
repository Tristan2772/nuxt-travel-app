import { findLocation } from "~~/lib/db/queries/location";
import { insertLocationLog } from "~~/lib/db/queries/location-log";
import { InsertLocationLog } from "~~/lib/db/schema";

import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-errors";

export default defineAuthenticatedEventHandler(async (event) => {
  const slug = getRouterParam(event, "slug") as string;
  const location = await findLocation(slug, event.context.user.id);
  const result = await readValidatedBody(event, InsertLocationLog.safeParse);

  if (!location) {
    return sendError(event, createError({
      statusCode: 404,
      statusMessage: "Location not found.",
    }));
  }

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  return insertLocationLog(location.id, result.data, event.context.user.id);
});
