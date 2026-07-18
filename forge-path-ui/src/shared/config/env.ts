import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:8000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("FORGE-PATH"),
  NEXT_PUBLIC_APP_VERSION: z.string().default("1.0.0"),
});

const getEnv = () => {
  const result = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
  });

  if (!result.success) {
    console.error("Invalid environment configuration:", result.error.format());
    return {
      NEXT_PUBLIC_API_URL: "http://localhost:8000",
      NEXT_PUBLIC_APP_NAME: "FORGE-PATH",
      NEXT_PUBLIC_APP_VERSION: "1.0.0",
    };
  }

  return result.data;
};

export const env = getEnv();
