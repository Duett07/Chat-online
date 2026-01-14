import z from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
});

const config = configSchema.parse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

if (!config.NEXT_PUBLIC_API_ENDPOINT) {
  throw new Error("All values declare in env not valid");
}

const envConfig = config.NEXT_PUBLIC_API_ENDPOINT;

export default envConfig;
