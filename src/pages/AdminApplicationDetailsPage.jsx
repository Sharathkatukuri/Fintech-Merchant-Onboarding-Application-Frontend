import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  addAdminApplicationRemarks,
  getAdminApplicationById,
  updateAdminApplicationStatus,
} from "../api/adminApi";

const backendBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "https://fintech-merchant-onboarding-application.onrender.com/api"
).replace(/\/api$/, "");

function AdminApplicationDetailsPage() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("Pending");
  const [reviewNotes, setReviewNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isSavingRemarks, setIsSavingRemarks] = useState(false);

  const loadApplication = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getAdminApplicationById(id);
      const details = data.data.application;
      setApplication(details);
      setStatus(details.status || "Pending");
      setReviewNotes(details.reviewNotes || "");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load application details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApplication();
  }, [id]);

  const handleStatusUpdate = async () => {
    setError("");
    setSuccess("");
    setIsSavingStatus(true);

    try {
      const data = await updateAdminApplicationStatus(id, { status });
      setApplication(data.data.application);
      setSuccess(`Application status updated to ${status}.`);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleRemarksSave = async () => {
    setError("");
    setSuccess("");

    if (!reviewNotes.trim()) {
      setError("Remarks are required.");
      return;
    }

    setIsSavingRemarks(true);

    try {
      const data = await addAdminApplicationRemarks(id, {
        reviewNotes,
      });
      setApplication(data.data.application);
      setSuccess("Remarks updated successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to save remarks."
      );
    } finally {
      setIsSavingRemarks(false);
    }
  };

  if (isLoading) {
    return (
      <section className="card">
        <h1>Application Details</h1>
        <p>Loading application details...</p>
      </section>
    );
  }

  if (error && !application) {
    return (
      <section className="card">
        <h1>Application Details</h1>
        <p className="message error-message standalone-message">{error}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h1>Application Details</h1>
        <p>Review merchant information, uploaded documents, and update status.</p>
      </div>

      {error ? <p className="message error-message standalone-message">{error}</p> : null}
      {success ? (
        <p className="message success-message standalone-message">{success}</p>
      ) : null}

      <div className="info-grid">
        <div className="info-item">
          <span>Business Name</span>
          <strong>{application?.businessName || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Owner Name</span>
          <strong>{application?.merchant?.ownerName || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Email</span>
          <strong>{application?.merchant?.email || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Phone</span>
          <strong>{application?.merchant?.phone || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Registration Number</span>
          <strong>{application?.registrationNumber || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Category</span>
          <strong>{application?.category || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Tax ID</span>
          <strong>{application?.taxId || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Website</span>
          <strong>{application?.website || "-"}</strong>
        </div>
      </div>

      <div className="admin-section">
        <h2>Uploaded Documents</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Original File</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {application?.documents?.length ? (
                application.documents.map((document) => (
                  <tr key={document._id || document.id}>
                    <td>{document.documentType}</td>
                    <td>{document.originalName}</td>
                    <td>{document.status}</td>
                    <td>
                      <a
                        className="inline-link"
                        href={`${backendBaseUrl}${document.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View / Download
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No documents uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-section">
        <h2>Update Status</h2>
        <div className="action-row">
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button type="button" onClick={handleStatusUpdate} disabled={isSavingStatus}>
            {isSavingStatus ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>

      <div className="admin-section">
        <h2>Add Remarks</h2>
        <textarea
          className="textarea-field"
          rows="5"
          value={reviewNotes}
          onChange={(event) => setReviewNotes(event.target.value)}
          placeholder="Write internal remarks or review comments"
        />
        <div className="action-row">
          <button type="button" onClick={handleRemarksSave} disabled={isSavingRemarks}>
            {isSavingRemarks ? "Saving..." : "Save Remarks"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminApplicationDetailsPage;
