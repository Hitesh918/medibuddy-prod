import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "../store/store";
import { logout } from "../store/slices/authSlice";
import Logo from "../assets/logo.png";
import {
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  UserCircle,
  Stethoscope,
  Users,
} from "lucide-react";

const Navbar: React.FC<{ onMenuClick?: () => void }> = ({ onMenuClick }) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const signupDropdownRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSignupDropdownOpen, setIsSignupDropdownOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
      if (
        signupDropdownRef.current &&
        !signupDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSignupDropdownOpen(false);
      }
      if (
        loginDropdownRef.current &&
        !loginDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLoginDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserDropdownOpen(false);
    navigate("/login");
  };

  const navLinks = [
    { href: "/symptom-checker", label: "Symptom Checker" },
    { href: "/treatments", label: "Treatments" },
    { href: "/hospitals", label: "Hospitals" },
    { href: "/report-analysis", label: "Report Analysis" },
  ];

  // --- Logged-In User Navbar ---
  const renderLoggedInNav = () => (
    <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 w-full bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button for Sidebar */}
        <div className="lg:hidden">
          <button onClick={onMenuClick} className="text-gray-600 p-2 -ml-2">
            <Menu size={24} />
          </button>
        </div>

        {/* MediiMate Logo for Desktop View */}
        <div className="hidden lg:flex">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Mediimate company logo"
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-gray-800">MediiMate</span>
          </Link>
        </div>
      </div>

      {/* User Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          className="flex items-center gap-2 text-gray-700 rounded-full p-1 pr-3 transition hover:bg-gray-100"
        >
          <User
            size={28}
            className="bg-gray-200 rounded-full p-1.5 text-gray-600"
          />
          <span className="font-medium text-sm hidden sm:block">
            {user?.name}
          </span>
          <ChevronDown
            size={16}
            className={`transition-transform text-gray-500 ${
              isUserDropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isUserDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10 overflow-hidden">
            <Link
              to="/profile"
              onClick={() => setIsUserDropdownOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
            >
              <UserCircle size={18} />
              <span>My Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // --- Logged-Out Guest Navbar ---
  const renderGuestNav = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-20 items-center justify-between">
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img src={Logo} alt="Mediimate company logo" className="h-8 w-8" />
            <span className="text-2xl font-medium text-white">MediiMate</span>
          </Link>
        </div>
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <div className="flex items-center gap-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-md font-normal tracking-wide text-white/90 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center">
          <div className="hidden md:flex items-center gap-x-4">
            {/* Login Dropdown */}
            <div className="relative" ref={loginDropdownRef}>
              <button
                onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                className="flex items-center gap-2 text-sm font-medium border border-gray-100/50 px-4 py-2 rounded-lg text-white/90 transition-colors hover:text-white hover:bg-gray-100/10"
              >
                Login
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isLoginDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isLoginDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10 overflow-hidden">
                  <Link
                    to="/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users size={18} className="text-blue-600" />
                    <span>Patient Login</span>
                  </Link>
                  <Link
                    to="/doctor/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Stethoscope size={18} className="text-teal-600" />
                    <span>Doctor Login</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Sign Up Dropdown */}
            <div className="relative" ref={signupDropdownRef}>
              <button
                onClick={() => setIsSignupDropdownOpen(!isSignupDropdownOpen)}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500"
              >
                Sign Up
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    isSignupDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isSignupDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-10 overflow-hidden">
                  <Link
                    to="/register"
                    onClick={() => setIsSignupDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Users size={18} className="text-blue-600" />
                    <span>Patient Sign Up</span>
                  </Link>
                  <Link
                    to="/doctor/register"
                    onClick={() => setIsSignupDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Stethoscope size={18} className="text-teal-600" />
                    <span>Doctor Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden ml-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/50 backdrop-blur-md p-6 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-lg text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-white/20 pt-4">
            <div className="space-y-4">
              {/* Mobile Login Section */}
              <div className="space-y-2">
                <p className="text-sm text-white/70 font-semibold">Login</p>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-md border border-white/50 px-4 py-2 text-white transition hover:bg-white/10"
                >
                  <Users size={18} />
                  <span>Patient Login</span>
                </Link>
                <Link
                  to="/doctor/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-md border border-white/50 px-4 py-2 text-white transition hover:bg-white/10"
                >
                  <Stethoscope size={18} />
                  <span>Doctor Login</span>
                </Link>
              </div>

              {/* Mobile Sign Up Section */}
              <div className="space-y-2">
                <p className="text-sm text-white/70 font-semibold">Sign Up</p>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500"
                >
                  <Users size={18} />
                  <span>Patient Sign Up</span>
                </Link>
                <Link
                  to="/doctor/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 w-full rounded-md bg-teal-600 px-4 py-2 text-white transition hover:bg-teal-500"
                >
                  <Stethoscope size={18} />
                  <span>Doctor Sign Up</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const navClass = isAuthenticated
    ? "fixed top-0 left-0 w-full z-30"
    : `fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-black/30 backdrop-blur-lg" : "bg-transparent"
      }`;

  return (
    <nav className={navClass}>
      {isAuthenticated ? renderLoggedInNav() : renderGuestNav()}
    </nav>
  );
};

export default Navbar;
