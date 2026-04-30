import { useEffect, useState } from "react";

import { getApplicationStatus } from "../api/applicationApi";

function StatusPage() {
  const [application, setApplication] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const data = await getApplicationStatus();
        setApplication(data.data.application);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message ||
            "Unable to fetch application status."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (isLoading) {
    return (
      <section className="card">
        <h1>Status Page</h1>
        <p>Loading application status...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="card">
        <h1>Status Page</h1>
        <p className="message error-message">{error}</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="card-header">
        <h1>Status Page</h1>
        <p>Current review state of your merchant application.</p>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <span>Application ID</span>
          <strong>{application?.id || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Business Name</span>
          <strong>{application?.businessName || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Status</span>
          <strong>{application?.status || "-"}</strong>
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
          <span>Review Notes</span>
          <strong>{application?.reviewNotes || "No remarks yet."}</strong>
        </div>
        <div className="info-item">
          <span>Uploaded Documents</span>
          <strong>{application?.documents?.length || 0}</strong>
        </div>
      </div>
    </section>
  );
}

export default StatusPage;
