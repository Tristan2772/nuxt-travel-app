import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  TURSO_CONNECTION_URL: z.string(),
  TURSO_AUTH_TOKEN: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

// eslint-disable-next-line node/no-process-env
export default EnvSchema.parse(process.env);
