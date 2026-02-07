import http from "@/lib/http";

const apiRequestMessage = {
  getConversations: () => http.get("/api/v1/conversations/get"),
  getMessages: (userId: string) => http.get(`/api/v1/messages/with/${userId}`),
  sendMessages: (body: { receiverId: string; content: string }) =>
    http.post(`/api/v1/messages/send`, body),
};

export default apiRequestMessage;
