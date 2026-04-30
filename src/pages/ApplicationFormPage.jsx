import { useEffect, useState } from "react";

import {
  getApplicationStatus,
  submitApplication,
} from "../api/applicationApi";
import { uploadDocument } from "../api/uploadApi";
import FormCard from "../components/FormCard";

const initialForm = {
  businessName: "",
  registrationNumber: "",
  taxId: "",
  category: "",
  website: "",
};

const documentFields = [
  { key: "pan", label: "PAN" },
  { key: "gstCertificate", label: "GST Certificate" },
  { key: "bankStatement", label: "Bank Statement" },
  { key: "registrationCertificate", label: "Registration Certificate" },
];

const documentLabelMap = documentFields.reduce((accumulator, item) => {
  accumulator[item.key] = item.label;
  return accumulator;
}, {});

const allowedDocumentTypes = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const validateApplicationForm = (formData) => {
  if (!formData.businessName.trim()) {
    return "Business name is required.";
  }

  if (!formData.registrationNumber.trim()) {
    return "Registration number is required.";
  }

  if (!formData.category.trim()) {
    return "Business category is required.";
  }

  if (
    formData.website &&
    !/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/.test(formData.website)
  ) {
    return "Please enter a valid website URL.";
  }

  return "";
};

function ApplicationFormPage() {
  const [formData, setFormData] = useState(initialForm);
  const [application, setApplication] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [fileInputResetKeys, setFileInputResetKeys] = useState(
    documentFields.reduce((accumulator, item) => {
      accumulator[item.key] = 0;
      return accumulator;
    }, {})
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadingKey, setUploadingKey] = useState("");

  useEffect(() => {
    const loadExistingApplication = async () => {
      try {
        const data = await getApplicationStatus();
        const existingApplication = data.data.application;
        setApplication(existingApplication);
      } catch {
        setApplication(null);
      }
    };

    loadExistingApplication();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event, key) => {
    const file = event.target.files?.[0];
    setUploadSuccess("");

    if (!file) {
      return;
    }

    if (!allowedDocumentTypes.includes(file.type)) {
      setUploadError("Only PDF, JPG, JPEG, and PNG files are allowed.");
      setFileInputResetKeys((current) => ({
        ...current,
        [key]: current[key] + 1,
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Each file must be 5MB or smaller.");
      setFileInputResetKeys((current) => ({
        ...current,
        [key]: current[key] + 1,
      }));
      return;
    }

    setUploadError("");
    setSelectedFiles((current) => ({ ...current, [key]: file }));
  };

  const handleDocumentUpload = async (documentType) => {
    setUploadError("");
    setUploadSuccess("");

    if (!application?.id) {
      setUploadError("Submit the application before uploading documents.");
      return;
    }

    const file = selectedFiles[documentType];

    if (!file) {
      setUploadError("Please choose a file before uploading.");
      return;
    }

    setUploadingKey(documentType);

    try {
      await uploadDocument({
        applicationId: application.id,
        documentType,
        file,
      });

      const data = await getApplicationStatus();
      setApplication(data.data.application);
      setUploadSuccess(
        `${documentLabelMap[documentType] || "Document"} submitted successfully.`
      );
      setSelectedFiles((current) => ({ ...current, [documentType]: null }));
      setFileInputResetKeys((current) => ({
        ...current,
        [documentType]: current[documentType] + 1,
      }));
    } catch (requestError) {
      setUploadError(
        requestError.response?.data?.message ||
          "Document upload failed. Please try again."
      );
    } finally {
      setUploadingKey("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateApplicationForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await submitApplication(formData);
      setApplication(data.data.application);
      setFormData(initialForm);
      const storedUser = JSON.parse(localStorage.getItem("viyona_user") || "{}");
      localStorage.setItem(
        "viyona_user",
        JSON.stringify({
          ...storedUser,
          applicationStatus: data.data.application.status,
        })
      );
      setSuccess("Application submitted successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Application submission failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Application Form"
      description="Submit your merchant application details for review."
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <input name="businessName" placeholder="Business name" value={formData.businessName} onChange={handleChange} required />
        <input name="registrationNumber" placeholder="Registration number" value={formData.registrationNumber} onChange={handleChange} required />
        <input name="taxId" placeholder="Tax ID" value={formData.taxId} onChange={handleChange} />
        <input name="category" placeholder="Business category" value={formData.category} onChange={handleChange} required />
        <input name="website" placeholder="Website URL" value={formData.website} onChange={handleChange} />
        {error ? <p className="message error-message">{error}</p> : null}
        {success ? <p className="message success-message">{success}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>

      <div className="upload-section">
        <div className="card-header">
          <h2>Upload Documents</h2>
          <p>Upload the required documents after the application is created.</p>
        </div>
        <div className="upload-grid">
          {documentFields.map((item) => (
            <div className="upload-item" key={item.key}>
              <label htmlFor={item.key}>{item.label}</label>
              <input
                key={fileInputResetKeys[item.key]}
                id={item.key}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => handleFileChange(event, item.key)}
              />
              <button
                type="button"
                onClick={() => handleDocumentUpload(item.key)}
                disabled={uploadingKey === item.key}
              >
                {uploadingKey === item.key ? "Uploading..." : `Upload ${item.label}`}
              </button>
            </div>
          ))}
        </div>
        {uploadError ? <p className="message error-message">{uploadError}</p> : null}
        {uploadSuccess ? <p className="message success-message">{uploadSuccess}</p> : null}
      </div>
    </FormCard>
  );
}

export default ApplicationFormPage;
