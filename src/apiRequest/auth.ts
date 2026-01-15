import {
  LoginRes,
  LoginSchema,
  RegisterRes,
  RegisterSchema,
} from "@/app/schemaValidations/auth.schema";
import http from "@/lib/http";

const apiRequest = {
  register: (body: RegisterSchema) =>
    http.post<RegisterRes>("/api/v1/auth/register", body),
  login: (body: LoginSchema) => http.post<LoginRes>("/api/v1/auth/login", body),
  auth: (body: { accessToken: string; expiresAt: string }) =>
    http.post("api/auth", body, {
      baseURL: "",
    }),
  logout: () =>
    http.post(
      "/api/auth/logout",
      {},
      {
        baseURL: "",
      }
    ),
};

export default apiRequest;
