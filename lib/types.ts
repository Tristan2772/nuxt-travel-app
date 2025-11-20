import type { UserWithID } from "./auth";
import "h3";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithID;
  }
}
