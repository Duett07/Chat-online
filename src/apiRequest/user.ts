import http from "@/lib/http";

const userApiResquest = {
  getProfile: () => http.get("/api/v1/user/profile"),
  updateProfile: (body: {
    displayName: string;
    gender: string;
    dateOfBirth: string;
  }) => http.put("/api/v1/user/update", body),
};

export default userApiResquest;
