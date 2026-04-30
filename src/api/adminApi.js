import axiosInstance from "./axiosInstance";

export const loginAdmin = async (payload) => {
  const response = await axiosInstance.post("/auth/admin/login", payload);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await axiosInstance.get("/admin/dashboard/stats");
  return response.data;
};

export const getAdminApplications = async (filters = {}) => {
  const response = await axiosInstance.get("/admin/applications", {
    params: filters,
  });
  return response.data;
};

export const getAdminApplicationById = async (id) => {
  const response = await axiosInstance.get(`/admin/applications/${id}`);
  return response.data;
};

export const updateAdminApplicationStatus = async (id, payload) => {
  const response = await axiosInstance.patch(
    `/admin/applications/${id}/status`,
    payload
  );
  return response.data;
};

export const addAdminApplicationRemarks = async (id, payload) => {
  const response = await axiosInstance.patch(
    `/admin/applications/${id}/remarks`,
    payload
  );
  return response.data;
};

export const exportAdminApplicationsCsv = async (filters = {}) => {
  const response = await axiosInstance.get("/admin/applications/export/csv", {
    params: filters,
    responseType: "blob",
  });
  return response.data;
};
