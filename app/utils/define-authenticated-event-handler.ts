import type { UserWithID } from "~~/lib/auth";
import type { H3Event, H3EventContext } from "h3";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithID;
  };
};

export default function defineAuthenticatedEventHandler<T>(handler: (event: AuthenticatedEvent) => T) {
  return defineEventHandler(async (event) => {
    // if no user, then return with error
    if (!event.context.user) {
      return sendError(event, createError ({
        statusCode: 401,
        statusMessage: "Unauthorized Access",
      }));
    }

    return handler(event as AuthenticatedEvent);
  });
}
