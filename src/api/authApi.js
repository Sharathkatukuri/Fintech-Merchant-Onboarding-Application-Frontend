import axiosInstance from "./axiosInstance";

export const registerMerchant = async (payload) => {
  const response = await axiosInstance.post("/auth/merchant/register", payload);
  return response.data;
};

export const loginMerchant = async (payload) => {
  const response = await axiosInstance.post("/auth/merchant/login", payload);
  return response.data;
};

export const loginAdmin = async (payload) => {
  const response = await axiosInstance.post("/auth/admin/login", payload);
  return response.data;
};
