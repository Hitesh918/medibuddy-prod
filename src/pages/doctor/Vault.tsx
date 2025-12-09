import React, { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../../store/store";
import toast from "react-hot-toast";
import { vaultAPI } from "../../services/api";
import PinModal from "../../components/PinModal";
import {
  Lock,
  FileText,
  Calendar,
  User,
  Heart,
  AlertCircle,
  Phone,
  Download,
  Filter,
} from "lucide-react";

interface PatientInfo {
  name: string;
  email?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  allergies?: string[];
  chronicConditions?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface MedicalRecord {
  _id: string;
  type: string;
  title: string;
  description?: string;
  doctorName?: string;
  hospitalName?: string;
  date: string;
  notes?: string;
  files?: Array<{ url: string; filename: string }>;
}

const Vault: React.FC = () => {
  const { doctor } = useSelector((state: RootState) => state.doctorAuth);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const handlePinSubmit = async (pin: string) => {
    setLoading(true);
    try {
      const response = await vaultAPI.accessRecords(pin);
      setPatientInfo(response.data.patientInfo);
      setRecords(response.data.records);
      setIsPinModalOpen(false);
      toast.success(
        `Records loaded for ${response.data.patientInfo.name} (${response.data.totalRecords} records)`
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Failed to access medical records"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords =
    selectedFilter === "all"
      ? records
      : records.filter((r) => r.type === selectedFilter);

  const recordTypes = [
    { value: "all", label: "All Records", count: records.length },
    {
      value: "prescription",
      label: "Prescriptions",
      count: records.filter((r) => r.type === "prescription").length,
    },
    {
      value: "lab_report",
      label: "Lab Reports",
      count: records.filter((r) => r.type === "lab_report").length,
    },
    {
      value: "scan",
      label: "Scans",
      count: records.filter((r) => r.type === "scan").length,
    },
    {
      value: "diagnosis",
      label: "Diagnosis",
      count: records.filter((r) => r.type === "diagnosis").length,
    },
  ];

  const getRecordTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      prescription: "bg-blue-100 text-blue-800",
      lab_report: "bg-green-100 text-green-800",
      scan: "bg-purple-100 text-purple-800",
      diagnosis: "bg-red-100 text-red-800",
      vaccination: "bg-yellow-100 text-yellow-800",
      surgery: "bg-orange-100 text-orange-800",
      consultation: "bg-teal-100 text-teal-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[type] || colors.other;
  };

  return (
    <div className="space-y-6 p-2 md:p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Medical Vault</h1>
          <p className="mt-1 text-gray-500">
            Securely access patient medical records
          </p>
        </div>
        <button
          onClick={() => setIsPinModalOpen(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          <Lock size={20} />
          Access Records
        </button>
      </div>

      {/* No Records State */}
      {!patientInfo && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-6 rounded-full">
              <Lock className="h-12 w-12 text-teal-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, Dr. {doctor?.name}
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Enter a patient's 6-digit PIN to securely access their complete
            medical history and records.
          </p>
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            <Lock size={20} />
            Enter PIN to Start
          </button>
        </div>
      )}

      {/* Patient Info & Records */}
      {patientInfo && (
        <>
          {/* Patient Info Card */}
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{patientInfo.name}</h2>
                {patientInfo.email && (
                  <p className="text-teal-100">{patientInfo.email}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setPatientInfo(null);
                  setRecords([]);
                  setSelectedFilter("all");
                }}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {patientInfo.bloodGroup && (
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart size={16} />
                    <span className="text-xs font-medium">Blood Group</span>
                  </div>
                  <p className="font-bold">{patientInfo.bloodGroup}</p>
                </div>
              )}
              {patientInfo.dateOfBirth && (
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} />
                    <span className="text-xs font-medium">Date of Birth</span>
                  </div>
                  <p className="font-bold">
                    {new Date(patientInfo.dateOfBirth).toLocaleDateString()}
                  </p>
                </div>
              )}
              {patientInfo.allergies && patientInfo.allergies.length > 0 && (
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={16} />
                    <span className="text-xs font-medium">Allergies</span>
                  </div>
                  <p className="font-bold">{patientInfo.allergies.join(", ")}</p>
                </div>
              )}
              {patientInfo.emergencyContact && (
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone size={16} />
                    <span className="text-xs font-medium">Emergency</span>
                  </div>
                  <p className="font-bold text-sm">
                    {patientInfo.emergencyContact.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={20} className="text-gray-600" />
              <span className="font-semibold text-gray-800">Filter Records</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recordTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedFilter(type.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedFilter === type.value
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
          </div>

          {/* Records List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Medical Records ({filteredRecords.length})
            </h3>
            {filteredRecords.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No records found for this filter</p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <div
                  key={record._id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRecordTypeColor(
                            record.type
                          )}`}
                        >
                          {record.type.replace("_", " ").toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {record.title}
                      </h4>
                      {record.description && (
                        <p className="text-gray-600 mt-1">{record.description}</p>
                      )}
                    </div>
                  </div>

                  {(record.doctorName || record.hospitalName) && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      {record.doctorName && (
                        <div className="flex items-center gap-1">
                          <User size={16} />
                          <span>{record.doctorName}</span>
                        </div>
                      )}
                      {record.hospitalName && (
                        <div className="flex items-center gap-1">
                          <FileText size={16} />
                          <span>{record.hospitalName}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {record.notes && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>Notes:</strong> {record.notes}
                      </p>
                    </div>
                  )}

                  {record.files && record.files.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {record.files.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 transition"
                        >
                          <Download size={16} />
                          {file.filename}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* PIN Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSubmit={handlePinSubmit}
        loading={loading}
      />
    </div>
  );
};

export default Vault;