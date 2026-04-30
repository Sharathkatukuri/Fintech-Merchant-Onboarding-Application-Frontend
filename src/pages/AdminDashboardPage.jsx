import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  exportAdminApplicationsCsv,
  getAdminApplications,
  getAdminStats,
} from "../api/adminApi";

const initialFilters = {
  businessName: "",
  email: "",
  status: "",
};

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const loadDashboard = async (activeFilters = filters) => {
    setError("");
    setIsLoading(true);

    try {
      const [statsResponse, applicationsResponse] = await Promise.all([
        getAdminStats(),
        getAdminApplications(activeFilters),
      ]);

      setStats(statsResponse.data.stats);
      setApplications(applicationsResponse.data.applications);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to load admin dashboard data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
  };

  const handleFilterSubmit = async (event) => {
    event.preventDefault();
    await loadDashboard(filters);
  };

  const handleResetFilters = async () => {
    setFilters(initialFilters);
    await loadDashboard(initialFilters);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const csvBlob = await exportAdminApplicationsCsv(filters);
      const blobUrl = window.URL.createObjectURL(csvBlob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "merchant-applications.csv";
      link.click();
      window.URL.revokeObjectURL(blobUrl);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to export applications to CSV."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="card">
      <div className="card-header">
        <h1>Admin Dashboard</h1>
        <p>Review merchant applications, filter records, and export results.</p>
      </div>

      {stats ? (
        <div className="stats-grid">
          <div className="info-item">
            <span>Total Applications</span>
            <strong>{stats.totalApplications}</strong>
          </div>
          <div className="info-item">
            <span>Total Merchants</span>
            <strong>{stats.totalMerchants}</strong>
          </div>
          <div className="info-item">
            <span>Total Documents</span>
            <strong>{stats.totalDocuments}</strong>
          </div>
          <div className="info-item">
            <span>Pending</span>
            <strong>{stats.pendingCount}</strong>
          </div>
          <div className="info-item">
            <span>Under Review</span>
            <strong>{stats.underReviewCount}</strong>
          </div>
          <div className="info-item">
            <span>Approved</span>
            <strong>{stats.approvedCount}</strong>
          </div>
          <div className="info-item">
            <span>Rejected</span>
            <strong>{stats.rejectedCount}</strong>
          </div>
        </div>
      ) : null}

      <form className="filter-grid" onSubmit={handleFilterSubmit}>
        <input
          name="businessName"
          placeholder="Filter by business name"
          value={filters.businessName}
          onChange={handleFilterChange}
        />
        <input
          name="email"
          placeholder="Filter by merchant email"
          value={filters.email}
          onChange={handleFilterChange}
        />
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All statuses</option>
          <option value="Pending">Pending</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
        <button type="submit">Apply Filters</button>
        <button type="button" className="secondary-button" onClick={handleResetFilters}>
          Reset
        </button>
        <button type="button" onClick={handleExport} disabled={isExporting}>
          {isExporting ? "Exporting..." : "Export CSV"}
        </button>
      </form>

      {error ? <p className="message error-message standalone-message">{error}</p> : null}

      {isLoading ? (
        <p>Loading applications...</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Business Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5">No applications found.</td>
                </tr>
              ) : null}
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>{application.businessName}</td>
                  <td>{application.merchant?.email || "-"}</td>
                  <td>{application.status}</td>
                  <td>{new Date(application.submittedAt).toLocaleString()}</td>
                  <td>
                    <Link
                      className="inline-link"
                      to={`/admin/applications/${application.id}`}
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminDashboardPage;
