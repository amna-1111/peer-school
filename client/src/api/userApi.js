import api from "./axios";

export const getProfile = (id) => api.get(`/users/${id}`);
export const updateProfile = (data) => api.put("/users/profile", data);
export const getDashboard = () => api.get("/users/dashboard");
export const uploadPhoto = (formData) =>
  api.post("/users/upload-photo", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const changePassword = (data) => api.put("/users/change-password", data);
