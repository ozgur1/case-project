// frontend/web-client/src/api.js
const BASE = import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") || "http://localhost:5224";

async function j(method, url, body) {
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} :: ${text}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  // USERS
  register: (nickname) => j("POST", "/api/users/register", { nickname }),
  login: (nickname) => j("POST", "/api/users/login", { nickname }),
  listUsers: () => j("GET", "/api/users"),

  // CONVERSATIONS
  conversationsOf: (userId) => j("GET", `/api/conversations/of-user/${userId}`),

  // MESSAGES
  messagesOfConversation: (conversationId) =>
    j("GET", `/api/messages/conversation/${conversationId}`),

  sendMessageToUser: (receiverId, senderId, content) =>
    j("POST", `/api/messages/user/${receiverId}`, { senderId, content }),
};
