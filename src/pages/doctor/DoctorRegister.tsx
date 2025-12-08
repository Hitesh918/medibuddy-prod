import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { doctorAuthAPI } from "../../services/api";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import Logo from "../../assets/logo.png";

const InputField = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  name,
  required = false,
  placeholder = "",
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  placeholder?: string;
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
      />
    </div>
  );
};

const PasswordField = ({
  id,
  label,
  value,
  onChange,
  name,
  required = false,
  placeholder = "",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  placeholder?: string;
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={isPasswordVisible ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="w-full h-11 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700"
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
        >
          {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
};

const DoctorRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    licenseNumber: "",
    hospital: "",
    experience: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      specialization,
      licenseNumber,
      hospital,
      experience,
    } = formData;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !specialization ||
      !licenseNumber
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Creating your account...");

    try {
      const dataToSubmit: any = {
        name,
        email,
        password,
        phone: `+91${phone}`,
        specialization,
        licenseNumber,
      };
      if (hospital) dataToSubmit.hospital = hospital;
      if (experience) dataToSubmit.experience = parseInt(experience, 10);

      await doctorAuthAPI.register(dataToSubmit);

      toast.success("Registration successful! Redirecting...", {
        id: loadingToastId,
      });

      setTimeout(() => {
        navigate("/doctor/login");
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed.", {
        id: loadingToastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Left Panel - Fixed */}
      <div className="relative hidden w-full flex-col justify-between bg-gradient-to-br from-teal-900 to-cyan-900 p-8 text-white lg:flex lg:sticky lg:top-0 lg:h-screen">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Mediimate company logo" className="h-8 w-8" />
            <span className="text-2xl font-bold">MediiMate</span>
          </Link>
          <div className="mt-12 flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Join Our Doctor Network
            </h1>
          </div>
          <p className="mt-4 text-lg text-teal-200">
            Register to access our secure medical records vault and provide
            better care to your patients.
          </p>
        </div>
        <div className="relative z-10 mt-auto">
          <div className="rounded-xl bg-black/20 p-6 backdrop-blur-sm">
            <blockquote className="text-sm leading-relaxed">
              "Joining this platform was the best decision for my practice.
              Patient records are always at my fingertips."
            </blockquote>
            <footer className="mt-4 flex items-center gap-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="https://i.pravatar.cc/150?img=28"
                alt="Dr. Johnson"
              />
              <div>
                <p className="font-semibold text-white">Dr. Michael Johnson</p>
                <p className="text-sm text-teal-200">General Physician</p>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Right Form Panel - Scrollable */}
      <div className="flex w-full flex-col py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <img
                src={Logo}
                alt="Mediimate company logo"
                className="h-8 w-8"
              />
              <span className="text-2xl font-bold text-gray-900">
                MediiMate
              </span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Doctor Account
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Join our network of healthcare professionals
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <InputField
              id="name"
              name="name"
              label="Full Name *"
              placeholder="Dr. John Doe"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              id="email"
              name="email"
              type="email"
              label="Email *"
              placeholder="doctor@hospital.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="w-full h-11 px-4 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition text-sm"
                  placeholder="98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <InputField
              id="specialization"
              name="specialization"
              label="Specialization *"
              placeholder="e.g., Cardiology, Pediatrics"
              value={formData.specialization}
              onChange={handleInputChange}
              required
            />

            <InputField
              id="licenseNumber"
              name="licenseNumber"
              label="Medical License Number *"
              placeholder="Enter your license number"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              required
            />

            <InputField
              id="hospital"
              name="hospital"
              label="Hospital/Clinic"
              placeholder="Your workplace (optional)"
              value={formData.hospital}
              onChange={handleInputChange}
            />

            <InputField
              id="experience"
              name="experience"
              type="number"
              label="Years of Experience"
              placeholder="0"
              value={formData.experience}
              onChange={handleInputChange}
            />

            <PasswordField
              id="password"
              name="password"
              label="Password *"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password *"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />

            <p className="text-xs text-gray-500 text-center py-2">
              By creating an account, you agree to our{" "}
              <a href="#" className="underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline">
                Privacy Policy
              </a>
              .
            </p>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            <p className="text-center text-sm text-gray-600 pt-2">
              Already have an account?{" "}
              <Link
                to="/doctor/login"
                className="font-medium text-teal-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Extra padding at bottom for mobile */}
        <div className="h-8"></div>
      </div>
    </div>
  );
};

export default DoctorRegister;
