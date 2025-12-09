import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authAPI } from "../services/api";
import { Eye, EyeOff, Heart } from "lucide-react";
import Logo from "../assets/logo.png";

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
        className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
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
          className="w-full h-11 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
      age,
      gender,
      address,
    } = formData;

    if (!name || !email || !password || !confirmPassword || !phone) {
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
      };
      if (age) dataToSubmit.age = parseInt(age, 10);
      if (gender) dataToSubmit.gender = gender;
      if (address) {
        dataToSubmit.location = {
          type: "Point",
          coordinates: [0, 0],
          address,
        };
      }

      await authAPI.register(dataToSubmit);

      toast.success("Registration successful! Redirecting...", {
        id: loadingToastId,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed.", {
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
      <div className="relative hidden w-full flex-col justify-between bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-white lg:flex lg:sticky lg:top-0 lg:h-screen">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl opacity-50"></div>
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Mediimate company logo" className="h-8 w-8" />
            <span className="text-2xl font-bold">MediiMate</span>
          </Link>
          <div className="mt-12 flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Heart className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Your Gateway to Better Health
            </h1>
          </div>
          <p className="mt-4 text-lg text-blue-200">
            Ready to embark on your wellness journey? Create an account to get
            started.
          </p>
        </div>
        <div className="relative z-10 mt-auto">
          <div className="rounded-xl bg-black/20 p-6 backdrop-blur-sm">
            <blockquote className="text-sm leading-relaxed">
              "This platform is a game-changer. Managing my prescriptions has
              never been easier."
            </blockquote>
            <footer className="mt-4 flex items-center gap-4">
              <img
                className="h-12 w-12 rounded-full object-cover"
                src="https://i.pravatar.cc/150?img=5"
                alt="Sarah L."
              />
              <div>
                <p className="font-semibold text-white">Sarah L.</p>
                <p className="text-sm text-blue-200">Verified User</p>
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
              Create Your Account
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Ready to embark on your wellness journey? Sign up now!
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <InputField
              id="name"
              name="name"
              label="Full Name *"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <InputField
              id="email"
              name="email"
              type="email"
              label="Email *"
              placeholder="Enter your email"
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
                  className="w-full h-11 px-4 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm"
                  placeholder="98XXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <PasswordField
              id="password"
              name="password"
              label="Password *"
              placeholder="Enter a secure password"
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
                className="w-full h-11 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Create Account & Continue"
                )}
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <p className="text-center text-sm text-gray-600 pt-2">
              Already a member?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:underline"
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

export default Register;
