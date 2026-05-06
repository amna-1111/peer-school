import api from "./axios";

export const getAllSkills = (params) => api.get("/skills", { params });
export const getSkillById = (id) => api.get(`/skills/${id}`);

export const getInstructorSkills = (instructorId) =>
  api.get(`/skills/instructor/${instructorId}`);
export const createSkill = (data) => api.post("/skills", data);
export const updateSkill = (id, data) => api.put(`/skills/${id}`, data);
export const deleteSkill = (id) => api.delete(`/skills/${id}`);
