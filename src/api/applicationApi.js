import axiosInstance from "./axiosInstance";

export const submitApplication = async (payload) => {
  const response = await axiosInstance.post("/merchant/application", payload);
  return response.data;
};

export const getApplicationStatus = async () => {
  const response = await axiosInstance.get("/merchant/application/status");
  return response.data;
};
