import React from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import {
  Search,
  Stethoscope,
  MapPin,
  FileText,
  Clock,
  Activity,
  ArrowRight,
  CalendarDays,
  Bot,
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

  const recentActivity = [
    {
      icon: <Search className="h-5 w-5 text-blue-500" />,
      title: "Symptom check completed",
      time: "2 hours ago",
    },
    {
      icon: <MapPin className="h-5 w-5 text-indigo-500" />,
      title: "Hospital search",
      time: "1 day ago",
    },
    {
      icon: <FileText className="h-5 w-5 text-rose-500" />,
      title: "Report uploaded",
      time: "3 days ago",
    },
  ];

  const healthStats = [
    {
      icon: <CalendarDays className="h-6 w-6 text-indigo-500" />,
      label: "Consultations",
      value: "12",
      change: "+2 this month",
    },
    {
      icon: <Activity className="h-6 w-6 text-green-500" />,
      label: "Health Score",
      value: "85%",
      change: "+5% improved",
    },
    {
      icon: <FileText className="h-6 w-6 text-rose-500" />,
      label: "Reports",
      value: "8",
      change: "3 pending review",
    },
    {
      icon: <Clock className="h-6 w-6 text-gray-500" />,
      label: "Last Checkup",
      value: "2 weeks",
      change: "Next due in 1 month",
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

          {/* Health Overview */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Health Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {healthStats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </p>
                  </div>
                </div>
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

          {/* Recent Activity */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Activity
            </h2>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-center gap-4 p-2"
                >
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {activity.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-800">
                      {activity.title}
                    </h4>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Health Tip */}
          <section className="bg-teal-50 border border-teal-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg border border-teal-200">
                <Bot className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-800">AI Health Tip</h3>
                <p className="text-sm text-teal-700 mt-1">
                  Stay hydrated by drinking at least 8 glasses of water daily.
                  It's key for digestion and energy.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
