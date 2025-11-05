import api from "./apiClient";

export const queryAI = async (query) => {
  const res = await api.post("ai/query/", { query });
  return res.data;
};
