import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerMerchant } from "../api/authApi";
import FormCard from "../components/FormCard";
import { setAuthSession } from "../utils/authStorage";

const initialForm = {
  businessName: "",
  ownerName: "",
  email: "",
  phone: "",
  password: "",
  businessType: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

const validateRegisterForm = (formData) => {
  if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    return "Please enter a valid email address.";
  }

  if (!/^[0-9]{10,15}$/.test(formData.phone)) {
    return "Phone number must contain 10 to 15 digits.";
  }

  if (formData.password.length < 8) {
    return "Password must be at least 8 characters long.";
  }

  return "";
};

function RegisterPage() {
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateRegisterForm(formData);

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await registerMerchant(formData);
      setAuthSession({
        token: data.token,
        user: data.data.user,
      });
      setSuccess("Registration successful. Redirecting to dashboard...");
      navigate("/dashboard");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard
      title="Merchant Register"
      description="Create a merchant account to begin the application process."
    >
      <form className="form-grid" onSubmit={handleSubmit}>
        <input name="businessName" placeholder="Business name" value={formData.businessName} onChange={handleChange} required />
        <input name="ownerName" placeholder="Owner name" value={formData.ownerName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <input name="businessType" placeholder="Business type" value={formData.businessType} onChange={handleChange} required />
        <input name="addressLine1" placeholder="Address line 1" value={formData.addressLine1} onChange={handleChange} required />
        <input name="addressLine2" placeholder="Address line 2" value={formData.addressLine2} onChange={handleChange} />
        <input name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
        <input name="postalCode" placeholder="Postal code" value={formData.postalCode} onChange={handleChange} required />
        <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} required />
        {error ? <p className="message error-message">{error}</p> : null}
        {success ? <p className="message success-message">{success}</p> : null}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
    </FormCard>
  );
}

export default RegisterPage;
