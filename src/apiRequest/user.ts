import http from "@/lib/http";

const userApiResquest = {
  getProfile: () => http.get("/api/v1/user/profile"),
  updateProfile: (body: {
    displayName: string;
    gender: string;
    dateOfBirth: string;
  }) => http.put("/api/v1/user/update", body),

  findUser: (displayName: string) =>
    http.post("/api/v1/user/find-user", { displayName }),

  getUser: (id: string) => http.get(`/api/v1/user/get/${id}`),
};

export default userApiResquest;
