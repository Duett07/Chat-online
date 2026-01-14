import { RegisterSchema } from "@/app/schemaValidations/auth.schema";
import http from "@/lib/http";

const apiRequest = {
  register: (body: RegisterSchema) => http.post("/api/v1/auth/register", body),
};

export default apiRequest;
