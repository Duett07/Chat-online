import { z } from "zod";

export const registerBody = z
  .object({
    username: z
      .string()
      .min(2, { message: "Tên người dùng phải dài hơn 2 ký tự" })
      .max(30, { message: "Tên người dùng không được quá 30 ký tự" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải dài hơn 8 ký tự" })
      .regex(/[A-Z]/, {
        message: "Phải có ít nhất 1 chữ hoa",
      })
      .regex(/[a-z]/, {
        message: "Phải có ít nhất 1 chữ thường",
      })
      .regex(/[0-9]/, { message: "Phải có ít nhất 1 chữ số" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Phải có ít nhất 1 ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận lại mật khẩu" }),
  })
  .strict()
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
      });
    }
  });

export type RegisterSchema = z.infer<typeof registerBody>;
