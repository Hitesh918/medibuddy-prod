import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  User,
  Pill,
  Download,
  Eye,
  Plus,
  Clock,
  CheckCircle,
} from "lucide-react";

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientAvatar: string;
  date: string;
  diagnosis: string;
  medications: Medication[];
  status: "active" | "completed" | "expired";
  notes?: string;
}

const DoctorPrescriptions: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPrescription, setSelectedPrescription] =
    useState<Prescription | null>(null);

  // Dummy prescriptions data
  const prescriptions: Prescription[] = [
    {
      id: "RX001",
      patientName: "Dhiraj",
      patientAvatar: "https://i.pravatar.cc/150?img=12",
      date: "2025-11-10",
      diagnosis: "Hypertension",
      status: "active",
      medications: [
        {
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
        },
      ],
      notes: "Complete the full course. Return if symptoms persist.",
    },
    {
      id: "RX002",
      patientName: "Sarah",
      patientAvatar: "https://i.pravatar.cc/150?img=5",
      date: "2025-11-09",
      diagnosis: "Diabetes Type 2",
      status: "active",
      medications: [
        {
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
        },
      ],
      notes: "Complete the full course. Return if symptoms persist.",
    },
    {
      id: "RX003",
      patientName: "Ram Kumar",
      patientAvatar: "https://i.pravatar.cc/150?img=33",
      date: "2025-11-08",
      diagnosis: "Bacterial Infection",
      status: "completed",
      medications: [
        {
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
        },
      ],
      notes: "Complete the full course. Return if symptoms persist.",
    },
  ];

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          icon: <CheckCircle size={16} />,
        };
      case "completed":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <CheckCircle size={16} />,
        };
      case "expired":
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Clock size={16} />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <FileText size={16} />,
        };
    }
  };

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const matchesSearch =
      rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || rx.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: "Total Prescriptions",
      value: prescriptions.length,
      icon: <FileText className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Active",
      value: prescriptions.filter((p) => p.status === "active").length,
      icon: <CheckCircle className="h-5 w-5" />,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Completed",
      value: prescriptions.filter((p) => p.status === "completed").length,
      icon: <Pill className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Expired",
      value: prescriptions.filter((p) => p.status === "expired").length,
      icon: <Clock className="h-5 w-5" />,
      color: "text-gray-600 bg-gray-100",
    },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Prescriptions</h1>
          <p className="mt-1 text-gray-500">
            Manage patient prescriptions and medications
          </p>
        </div>
        <button className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium">
          <Plus size={20} />
          New Prescription
        </button>
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

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by patient name, diagnosis, or ID..."
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
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No prescriptions found</p>
          </div>
        ) : (
          filteredPrescriptions.map((prescription) => {
            const statusConfig = getStatusConfig(prescription.status);
            return (
              <div
                key={prescription.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <img
                      src={prescription.patientAvatar}
                      alt={prescription.patientName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-800">
                          {prescription.patientName}
                        </h3>
                        <span
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}
                        >
                          {statusConfig.icon}
                          {prescription.status.charAt(0).toUpperCase() +
                            prescription.status.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>ID: {prescription.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>
                            {new Date(prescription.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <p className="text-sm text-gray-700">
                          <strong>Diagnosis:</strong> {prescription.diagnosis}
                        </p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm font-semibold text-gray-800 mb-2">
                          Medications ({prescription.medications.length}):
                        </p>
                        <div className="space-y-2">
                          {prescription.medications.map((med, index) => (
                            <div
                              key={index}
                              className="flex items-start gap-2 text-sm text-gray-700"
                            >
                              <Pill
                                size={16}
                                className="text-teal-500 mt-0.5"
                              />
                              <span>
                                <strong>{med.name}</strong> - {med.dosage},{" "}
                                {med.frequency}, for {med.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {prescription.notes && (
                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                          <strong>Notes:</strong> {prescription.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex lg:flex-col gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                      <Eye size={16} />
                      View
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                      <Download size={16} />
                      Download
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

export default DoctorPrescriptions;
