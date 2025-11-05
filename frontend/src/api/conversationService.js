import api from "./apiClient";

export const getConversations = async () => {
  const res = await api.get("conversations/");
  return res.data;
};

export const getConversation = async (id) => {
  const res = await api.get(`conversations/${id}/`);
  return res.data;
};

export const createConversation = async (data) => {
  const res = await api.post("conversations/", data);
  return res.data;
};

export const sendMessage = async (id, message) => {
  const res = await api.post(`conversations/${id}/messages/`, message);
  return res.data;
};

export const endConversation = async (id) => {
  const res = await api.post(`conversations/${id}/end/`);
  return res.data;
};


// ✏️ Rename a conversation
export const renameConversation = async (id, newTitle) => {
  const res = await api.patch(`conversations/${id}/rename/`, { title: newTitle });
  if (!res || res.status >= 400) throw new Error("Failed to rename conversation");
  return res.data;
};

// 🗑️ Delete a conversation
export const deleteConversation = async (id) => {
  const res = await api.delete(`conversations/${id}/delete/`);
  if (!res || res.status >= 400) throw new Error("Failed to delete conversation");
  return res.data;
};