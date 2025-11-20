import defineAuthenticatedEventHandler from "~~/app/utils/define-authenticated-event-handler";
import { findLocations } from "~~/lib/db/queries/location";

export default defineAuthenticatedEventHandler(async (event) => {
  return findLocations(event.context.user.id);
});
