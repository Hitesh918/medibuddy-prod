import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { patientsAPI , healthLogsAPI } from "../../services/api";
import {
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  FileText,
  Heart,
  TrendingUp,
  Clock,
  ChevronRight,
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  phone: string;
  bloodGroup?: string;
  lastVisit?: string;
  condition?: string;
  status?: "stable" | "critical" | "recovering";
  avatar?: string;
}

const DoctorPatients: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
const [logs, setLogs] = useState<any>(null);
const [showModal, setShowModal] = useState(false);
const [logsLoading, setLogsLoading] = useState(false);


  // Fetch real patients mapped to this doctor
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("doctorToken");
        if (!token) return;

        const decoded: any = jwtDecode(token);

        const doctorPhone = decoded.phone;

        const response = await patientsAPI.getMappedPatients(doctorPhone);

        // Transform backend structure into UI-friendly structure
        const formattedPatients = response.data.data.map((p: any) => ({
          id: p._id,
          name: p.name,
          phone: p.phone,
          bloodGroup: p.blood_group || "Unknown",
          lastVisit: "2025-11-10", // you can update this when backend provides it
          condition: "General Checkup", // placeholder until backend provides it
          status: "stable", // placeholder
          avatar: `https://i.pravatar.cc/150?u=${p._id}`,
        }));

        setPatients(formattedPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const openPatientLogs = async (patient: Patient) => {
  try {
    setSelectedPatient(patient);
    setShowModal(true);
    setLogsLoading(true);

    const res = await healthLogsAPI.getLogsByPhone(patient.phone);
    console.log("Logs response:", res);
    setLogs(res.data); // { mealLogs: [...], vitalLogs: [...] }

  } catch (err) {
    console.error("Error fetching logs:", err);
  } finally {
    setLogsLoading(false);
  }
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case "stable":
        return "bg-green-100 text-green-700 border-green-200";
      case "recovering":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || patient.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = [
    {
      label: "Total Patients",
      value: patients.length,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Critical",
      value: patients.filter((p) => p.status === "critical").length,
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-600 bg-red-100",
    },
    {
      label: "Recovering",
      value: patients.filter((p) => p.status === "recovering").length,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-yellow-600 bg-yellow-100",
    },
    {
      label: "Stable",
      value: patients.filter((p) => p.status === "stable").length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-green-600 bg-green-100",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 mt-3">Loading patients...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">My Patients</h1>
        <p className="mt-1 text-gray-500">
          Manage and monitor your patient records
        </p>
      </div>

      {/* Stats */}
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

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-11 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="recovering">Recovering</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patients List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No patients found</p>
          </div>
        ) : (
          filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
              onClick={() => openPatientLogs(patient)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <img
                    src={patient.avatar}
                    alt={patient.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {patient.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          patient.status || "stable"
                        )}`}
                      >
                        {(patient.status || "stable")
                          .charAt(0)
                          .toUpperCase() +
                          (patient.status || "stable").slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{patient.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-red-500" />
                        <span>{patient.bloodGroup}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                          Last Visit:{" "}
                          {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <FileText size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700">
                        <strong>Condition:</strong>{" "}
                        {patient.condition || "General Checkup"}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {showModal && selectedPatient && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded-xl p-6 w-full max-w-xl shadow-lg relative">

      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-3">
        Logs for {selectedPatient.name}
      </h2>

      {logsLoading ? (
  <div className="text-center p-6">
    <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
    <p className="text-gray-500 mt-2">Loading logs…</p>
  </div>
) : logs ? (
  <div className="space-y-6 max-h-96 overflow-y-auto">

    {/* Meal Logs */}
    <div>
      <h3 className="text-lg font-semibold mb-2">🍽️ Meal Logs</h3>

      {logs.mealLogs.length === 0 ? (
        <p className="text-gray-500 text-sm">No meal logs found.</p>
      ) : (
        logs.mealLogs.map((log: any) => (
          <div key={log._id} className="border rounded-lg p-4 mb-3 bg-gray-50">
            
            <p className="text-sm text-gray-700">
              <strong>Date:</strong> {log.date} &nbsp; | &nbsp;
              <strong>Time:</strong> {log.time}
            </p>

            <p className="mt-1 text-sm text-gray-700">
              <strong>Meal Type:</strong> {log.meal_type}
            </p>

            <p className="mt-1 text-sm text-gray-700">
              <strong>Input:</strong> {log.input_type}
            </p>

            {log.description && (
              <p className="mt-1 text-sm text-gray-700">
                <strong>Description:</strong> {log.description}
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p><strong>Calories:</strong> {log.total_calories}</p>
              <p><strong>Carbs:</strong> {log.carbs_g}g</p>
              <p><strong>Protein:</strong> {log.protein_g}g</p>
              <p><strong>Fats:</strong> {log.fats_g}g</p>
              <p><strong>Health Score:</strong> {log.health_score}</p>
            </div>

            {log.items?.length > 0 && (
              <p className="mt-2 text-sm">
                <strong>Items:</strong> {log.items.join(", ")}
              </p>
            )}

            {log.analysis?.brief_assessment && (
              <p className="mt-2 text-sm text-gray-700">
                <strong>Assessment:</strong> {log.analysis.brief_assessment}
              </p>
            )}

            {log.analysis?.top_suggestion && (
              <p className="mt-1 text-sm text-gray-700">
                <strong>Suggestion:</strong> {log.analysis.top_suggestion}
              </p>
            )}

          </div>
        ))
      )}
    </div>

    {/* Vital Logs */}
    <div>
      <h3 className="text-lg font-semibold mb-2">📊 Vital Logs</h3>

      {logs.vitalLogs.length === 0 ? (
        <p className="text-gray-500 text-sm">No vital logs found.</p>
      ) : (
        logs.vitalLogs.map((log: any) => (
          <div key={log._id} className="border rounded-lg p-4 mb-3 bg-gray-50">

            <p className="text-sm text-gray-700">
              <strong>Date:</strong> {log.date} &nbsp; | &nbsp;
              <strong>Time:</strong> {log.time}
            </p>

            <p className="mt-1 text-sm">
              <strong>Type:</strong> {log.type}
            </p>

            <p className="mt-1 text-sm">
              <strong>Input:</strong> {log.input_type}
            </p>

            {log.description && (
              <p className="mt-1 text-sm text-gray-700">
                <strong>Description:</strong> {log.description}
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <p><strong>Calories:</strong> {log.calories_consumed}</p>
              <p><strong>Carbs:</strong> {log.carbs_g}g</p>
              <p><strong>Protein:</strong> {log.protein_g}g</p>
              <p><strong>Fats:</strong> {log.fats_g}g</p>
              <p><strong>Health Score:</strong> {log.health_score}</p>
            </div>

            {log.items?.length > 0 && (
              <p className="mt-2 text-sm">
                <strong>Items:</strong> {log.items.join(", ")}
              </p>
            )}

            {log.analysis?.brief_assessment && (
              <p className="mt-2 text-sm">
                <strong>Assessment:</strong> {log.analysis.brief_assessment}
              </p>
            )}

            {log.analysis?.top_suggestion && (
              <p className="mt-1 text-sm">
                <strong>Suggestion:</strong> {log.analysis.top_suggestion}
              </p>
            )}

          </div>
        ))
      )}
    </div>

  </div>
) : (
  <p className="text-gray-500">No logs found.</p>
)}

    </div>
  </div>
)}

    </div>
  );
};

export default DoctorPatients;
