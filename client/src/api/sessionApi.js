import api from "./axios";

export const getAvailableSlots = (instructorId) =>
  api.get(`/sessions/slots/${instructorId}`);
export const addSlot = (data) => api.post("/sessions/slots", data);
export const deleteSlot = (slotId) => api.delete(`/sessions/slots/${slotId}`);
export const bookSession = (data) => api.post("/sessions/book", data);
export const getMySessions = () => api.get("/sessions/my");
export const updateSessionStatus = (id, status) =>
  api.put(`/sessions/${id}/status`, { status });
