import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Filter,
  Search,
  Loader2,
} from "lucide-react";
import { appointmentAPI } from "../../services/api";

interface Appointment {
  _id: string;
  phone: string;
  patient_name: string;
  doctor_name: string;
  doctor_phone: string;
  specialization: string;
  hospital: string;
  slot: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pre_appointment_answers?: {
    symptoms?: string;
    symptom_duration?: string;
    current_medicines?: string;
  };
  created_at: string;
}

const DoctorAppointments: React.FC = () => {
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get doctor phone from localStorage
  const doctorInfoString = localStorage.getItem("doctorInfo");
  const doctor = doctorInfoString ? JSON.parse(doctorInfoString) : null;
  const doctorPhone = doctor.phone;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!doctorPhone) {
        setError("Doctor phone not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await appointmentAPI.getByDoctorPhone(doctorPhone);
        setAppointments(response.data.appointments || []);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching appointments:", err);
        setError(err.response?.data?.message || "Failed to fetch appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorPhone]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <CheckCircle size={16} />,
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
    const matchesSearch = apt.patient_name
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
      label: "Confirmed",
      value: appointments.filter((a) => a.status === "confirmed").length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-teal-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
        <p className="mt-1 text-gray-500">Manage your consultation schedule</p>
      </div>

      {/* Stats Grid */}

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
              <option value="confirmed">Confirmed</option>
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
                key={appointment._id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      {appointment.patient_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-800">
                          {appointment.patient_name}
                        </h3>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Phone size={16} />
                          <span>{appointment.phone}</span>
                        </div>
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
                          <span>{appointment.slot}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-green-500" />
                          <span>{appointment.hospital}</span>
                        </div>
                      </div>
                      {appointment.pre_appointment_answers && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                          {appointment.pre_appointment_answers.symptoms && (
                            <div>
                              <strong className="text-gray-700">Symptoms:</strong>{" "}
                              <span className="text-gray-600">
                                {appointment.pre_appointment_answers.symptoms}
                              </span>
                            </div>
                          )}
                          {appointment.pre_appointment_answers.symptom_duration && (
                            <div>
                              <strong className="text-gray-700">Duration:</strong>{" "}
                              <span className="text-gray-600">
                                {appointment.pre_appointment_answers.symptom_duration}
                              </span>
                            </div>
                          )}
                          {appointment.pre_appointment_answers.current_medicines && (
                            <div>
                              <strong className="text-gray-700">Current Medicines:</strong>{" "}
                              <span className="text-gray-600">
                                {appointment.pre_appointment_answers.current_medicines}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className="flex lg:flex-col gap-2">
                    {appointment.status === "confirmed" && (
                      <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium flex items-center gap-2">
                        <CheckCircle size={16} />
                        Start Consultation
                      </button>
                    )}
                    {appointment.status === "pending" && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2">
                        <CheckCircle size={16} />
                        Confirm
                      </button>
                    )}
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                      View Details
                    </button>
                  </div> */}
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
