import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import {
  Lock,
  FileText,
  Users,
  Calendar,
  Activity,
  TrendingUp,
} from "lucide-react";

const DoctorDashboard: React.FC = () => {
  const { doctor } = useSelector((state: RootState) => state.doctorAuth);

  const token = localStorage.getItem("doctorToken");
  console.log("Doctor Token in Dashboard:", token);


  const quickActions = [
    {
      icon: <Lock className="h-7 w-7 text-teal-600" />,
      title: "Access Vault",
      description: "View patient medical records",
      link: "/doctor/vault",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: <Users className="h-7 w-7 text-blue-600" />,
      title: "My Patients",
      description: "Manage patient information",
      link: "/doctor/patients",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <Calendar className="h-7 w-7 text-purple-600" />,
      title: "Appointments",
      description: "View scheduled consultations",
      link: "/doctor/appointments",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <FileText className="h-7 w-7 text-green-600" />,
      title: "Prescriptions",
      description: "Create and manage prescriptions",
      link: "/doctor/prescriptions",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    {
      label: "Patients Accessed Today",
      value: "0",
      change: "+0",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Records Viewed",
      value: "0",
      change: "+0",
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Consultations",
      value: "0",
      change: "+0",
      icon: <Activity className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "This Week",
      value: "0",
      change: "+0%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8 p-2 md:p-4">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, Dr. {doctor?.name}!
        </h1>
        <p className="text-teal-100">
          {doctor?.specialization} •{" "}
          {doctor?.hospital || "Independent Practice"}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-xs text-teal-100">License</p>
            <p className="font-semibold">{doctor?.licenseNumber}</p>
          </div>
          {doctor?.experience && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <p className="text-xs text-teal-100">Experience</p>
              <p className="font-semibold">{doctor.experience} years</p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <span className="text-sm font-semibold text-green-600">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              <div
                className={`h-2 bg-gradient-to-r ${action.color} group-hover:h-3 transition-all`}
              ></div>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg group-hover:scale-110 transition">
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-teal-600 transition">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
            <div className="bg-teal-100 p-2 rounded-lg">
              <Lock className="h-5 w-5 text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                Accessed medical records
              </p>
              <p className="text-sm text-gray-600">
                Patient: Roshan • 2 hours ago
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Created prescription</p>
              <p className="text-sm text-gray-600">
                Patient: Sarah • 5 hours ago
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">
                Completed consultation
              </p>
              <p className="text-sm text-gray-600">
                Patient: Prabin • 8 hours ago
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
