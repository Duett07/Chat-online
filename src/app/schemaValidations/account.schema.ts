import z from "zod";

export const AccountRes = z.object({
  data: z.object({
    id: z.string(),
    username: z.string(),
  }),
  message: z.string(),
}).strict();

export type AccountResType = z.infer<typeof AccountRes>;
