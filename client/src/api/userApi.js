import api from "./axios";

export const getProfile = (id) => api.get(`/users/${id}`);
export const updateProfile = (data) => api.put("/users/profile", data);
export const getDashboard = () => api.get("/users/dashboard");
