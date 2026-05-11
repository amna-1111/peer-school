import api from "./axios";

export const createReview = (data) => api.post("/reviews", data);
export const getInstructorReviews = (instructorId) =>
  api.get(`/reviews/instructor/${instructorId}`);
export const getSessionReview = (sessionId) =>
  api.get(`/reviews/session/${sessionId}`);

export const getSkillReviews = (skillId) =>
  api.get(`/reviews/skill/${skillId}`);
