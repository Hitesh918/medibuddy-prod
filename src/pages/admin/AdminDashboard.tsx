import React from "react";
import { Link } from "react-router-dom";
import { Users, UserPlus, ClipboardList, DollarSign, Activity, FileText, TrendingUp } from "lucide-react";

const AdminDashboard: React.FC = () => {
const quickActions = [
  {
    icon: <Users className="h-7 w-7 text-blue-600" />,
    title: "View All Doctors",
    description: "Manage registered doctors",
    link: "/admin/doctors",     // ✅ EDIT THIS
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: <UserPlus className="h-7 w-7 text-green-600" />,
    title: "Onboard Doctor",
    description: "Register a new doctor",
    link: "/admin/onboard-doctor",  // ✅ EDIT THIS
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <ClipboardList className="h-7 w-7 text-purple-600" />,
    title: "View Patients",
    description: "Access patient records",
    link: "/admin/patients",     // ✅ EDIT THIS → goes to AdminViewPatients
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <DollarSign className="h-7 w-7 text-orange-600" />,
    title: "View Sales",
    description: "Check sales and revenue",
    link: "/admin/sales",       // optional
    color: "from-orange-500 to-amber-500",
  },
];


  const stats = [
    {
      label: "Total Doctors",
      value: "42",
      change: "+3",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Total Patients",
      value: "312",
      change: "+12",
      icon: <ClipboardList className="h-5 w-5" />,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Today’s Revenue",
      value: "₹4,200",
      change: "+12%",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "This Week",
      value: "₹25,600",
      change: "+7%",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-orange-600 bg-orange-100",
    },
  ];

  return (
    <div className="space-y-8 p-2 md:p-4">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-indigo-100">System Overview & Controls</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-xs text-indigo-100">Role</p>
            <p className="font-semibold">Super Admin</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="text-xs text-indigo-100">System Status</p>
            <p className="font-semibold">Active</p>
          </div>
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
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
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
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
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
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Added New Doctor</p>
              <p className="text-sm text-gray-600">Dr. Priya • 1 hour ago</p>
            </div>
          </div>

          <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
            <div className="bg-green-100 p-2 rounded-lg">
              <ClipboardList className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Updated Patient Records</p>
              <p className="text-sm text-gray-600">Patient: Rahul • 3 hours ago</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-orange-100 p-2 rounded-lg">
              <DollarSign className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800">Reviewed Sales Report</p>
              <p className="text-sm text-gray-600">Today • 6 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
