import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormCard from "../components/FormCard";
import { loginAdmin } from "../api/authApi";
import { setAuthSession } from "../utils/authStorage";

function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid admin email address.");
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginAdmin(formData);
      setAuthSession({
        token: data.token,
        user: data.data.user,
      });
      navigate("/admin/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Admin login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Admin Login"
      description="Sign in to review merchant applications and manage statuses."
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Admin email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {error ? <p className="message error-message">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Admin Login"}
        </button>
      </form>
    </FormCard>
  );
}

export default AdminLoginPage;
