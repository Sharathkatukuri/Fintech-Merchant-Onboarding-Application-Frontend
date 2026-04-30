function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("viyona_user") || "{}");

  return (
    <section className="card">
      <div className="card-header">
        <h1>Dashboard</h1>
        <p>Overview of the merchant account currently signed in.</p>
      </div>
      <div className="info-grid">
        <div className="info-item">
          <span>Business Name</span>
          <strong>{user.businessName || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Owner Name</span>
          <strong>{user.ownerName || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Email</span>
          <strong>{user.email || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Phone</span>
          <strong>{user.phone || "-"}</strong>
        </div>
        <div className="info-item">
          <span>Application Status</span>
          <strong>{user.applicationStatus || "Pending"}</strong>
        </div>
      </div>
    </section>
  );
}

export default DashboardPage;
