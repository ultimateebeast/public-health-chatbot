const BASE_URL = "http://127.0.0.1:8000";

export const api = {
  login: async (data) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  createChat: async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}/chat/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
      },
      body: JSON.stringify({ title: "New Chat" }),
    });
    return res.json();
  },

  getChats: async (token) => {
    const res = await fetch(`${BASE_URL}/chat/sessions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  },

  sendMessage: async (chatId, message, token) => {
    const res = await fetch(`${BASE_URL}/chat/${chatId}/message`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 IMPORTANT
      },

      body: JSON.stringify({
        message: message,
        language: "en",
      }),
    });
    return res.json();
  },
};
