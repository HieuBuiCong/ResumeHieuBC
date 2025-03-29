import apiClient from "../utils/apiClient";

// ✅ Get all answers for a specific task
export const getTaskAnswers = async (taskId) => {
  try {
    const response = await apiClient.get(`/answers/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to fetch task answers");
  }
};

// ✅ Save answers for a specific task
export const saveTaskAnswers = async (taskId, answers) => {
  try {
    const response = await apiClient.put(`/answers/${taskId}/save`, { answers });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to save task answers");
  }
};

// ✅ Submit task answers
export const submitTaskAnswers = async (taskId) => {
  try {
    const response = await apiClient.post(`/answers/${taskId}/submit`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || "Failed to submit task answers");
  }
};
