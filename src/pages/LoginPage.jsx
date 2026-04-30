import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginMerchant } from "../api/authApi";
import FormCard from "../components/FormCard";
import { setAuthSession } from "../utils/authStorage";

const validateLoginForm = (formData) => {
  if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    return "Please enter a valid email address.";
  }

  if (!formData.password.trim()) {
    return "Password is required.";
  }

  return "";
};

function LoginPage() {
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

    const validationError = validateLoginForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await loginMerchant(formData);
      setAuthSession({
        token: data.token,
        user: data.data.user,
      });
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Merchant Login"
      description="Sign in to manage your application and review your status."
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        {error ? <p className="message error-message">{error}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </FormCard>
  );
}

export default LoginPage;
