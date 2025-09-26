import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import {
  Stethoscope,
  FileText,
  ArrowRight,
  HeartPulse,
  Building,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // --- Re-themed Data for the New Design ---

  const quickActions = [
    {
      icon: <HeartPulse className="h-7 w-7 text-blue-600" />,
      title: "Symptom Checker",
      description: "Analyze your symptoms with AI",
      link: "/symptom-checker",
    },
    {
      icon: <Stethoscope className="h-7 w-7 text-teal-600" />,
      title: "Find Treatments",
      description: "Search for medical procedures",
      link: "/treatments",
    },
    {
      icon: <Building className="h-7 w-7 text-indigo-600" />,
      title: "Hospital Finder",
      description: "Locate nearby hospitals & clinics",
      link: "/hospitals",
    },
    {
      icon: <FileText className="h-7 w-7 text-rose-600" />,
      title: "Report Analysis",
      description: "Upload and analyze reports",
      link: "/report-analysis",
    },
  ];

  return (
    <div className="space-y-8 p-2 md:p-4">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-gray-500">
          Ready to take charge of your health today?
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {quickActions.map((action) => (
                <Link
                  key={action.title}
                  to={action.link}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex items-center gap-5"
                >
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Start Your Treatment Journey */}
          <section className="bg-blue-600 rounded-xl p-6 text-white text-center shadow-lg md:mt-11">
            <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-semibold">Start a Treatment Journey</h2>
            <p className="text-sm text-blue-100 mt-1 mb-4">
              Find doctors and book consultations.
            </p>
            <Link
              to="/treatment-journey"
              className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <span>Begin Journey</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
