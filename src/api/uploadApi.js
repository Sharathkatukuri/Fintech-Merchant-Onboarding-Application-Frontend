import axiosInstance from "./axiosInstance";

export const uploadDocument = async ({ applicationId, documentType, file }) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axiosInstance.post(
    `/merchant/applications/${applicationId}/documents/${documentType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
