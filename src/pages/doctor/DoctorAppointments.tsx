import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Filter,
  Search,
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  patientAvatar: string;
  date: string;
  time: string;
  type: "in-person" | "video";
  status: "scheduled" | "completed" | "cancelled" | "pending";
  reason: string;
  duration: string;
  location?: string;
}

const DoctorAppointments: React.FC = () => {
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy appointments data
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Dhiraj",
      patientAvatar: "https://i.pravatar.cc/150?img=12",
      date: "2025-11-12",
      time: "09:00 AM",
      type: "in-person",
      status: "scheduled",
      reason: "Regular checkup",
      duration: "30 mins",
      location: "Clinic Room 101",
    },
    {
      id: "2",
      patientName: "Sarah ",
      patientAvatar: "https://i.pravatar.cc/150?img=5",
      date: "2025-11-12",
      time: "10:30 AM",
      type: "video",
      status: "scheduled",
      reason: "Follow-up consultation",
      duration: "20 mins",
    },
    {
      id: "3",
      patientName: "Ram Kumar",
      patientAvatar: "https://i.pravatar.cc/150?img=33",
      date: "2025-11-11",
      time: "02:00 PM",
      type: "in-person",
      status: "completed",
      reason: "Blood pressure monitoring",
      duration: "25 mins",
      location: "Clinic Room 102",
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "scheduled":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <Calendar size={16} />,
        };
      case "completed":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: <CheckCircle size={16} />,
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle size={16} />,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          icon: <AlertCircle size={16} />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock size={16} />,
        };
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const matchesDate =
      filterDate === "all" ||
      (filterDate === "today" &&
        apt.date === new Date().toISOString().split("T")[0]) ||
      (filterDate === "upcoming" && new Date(apt.date) >= new Date());
    return matchesSearch && matchesStatus && matchesDate;
  });

  const stats = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Scheduled",
      value: appointments.filter((a) => a.status === "scheduled").length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Completed",
      value: appointments.filter((a) => a.status === "completed").length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
      icon: <AlertCircle className="h-5 w-5" />,
      color: "text-yellow-600 bg-yellow-100",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        <p className="mt-1 text-gray-500">Manage your consultation schedule</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.color}`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <p className="text-sm text-gray-600 mt-3">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No appointments found</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => {
            const statusConfig = getStatusConfig(appointment.status);
            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={appointment.patientAvatar}
                      alt={appointment.patientName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {appointment.patientName}
                        </h3>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span>
                            {appointment.time} ({appointment.duration})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {appointment.type === "video" ? (
                            <Video size={16} className="text-blue-500" />
                          ) : (
                            <MapPin size={16} className="text-green-500" />
                          )}
                          <span>
                            {appointment.type === "video"
                              ? "Video Call"
                              : appointment.location}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Reason:</strong> {appointment.reason}
                      </div>
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2">
                    {appointment.status === "scheduled" && (
                      <>
                        {appointment.type === "video" ? (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
                            <Video size={16} />
                            Join Call
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium flex items-center gap-2">
                            <CheckCircle size={16} />
                            Check In
                          </button>
                        )}
                      </>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
