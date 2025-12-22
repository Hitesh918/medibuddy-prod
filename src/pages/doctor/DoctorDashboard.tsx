import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { doctorAvailabilityAPI } from "../../services/api";
import { type RootState } from "../../store/store";
import {
  Lock,
  FileText,
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Plus, Trash2, Clock, Hospital, Save
} from "lucide-react";

const DoctorDashboard: React.FC = () => {
  const doctorInfoString = localStorage.getItem("doctorInfo");
  const doctor = doctorInfoString ? JSON.parse(doctorInfoString) : null;


  const token = localStorage.getItem("doctorToken");
  console.log("Doctor Token in Dashboard:", token);

  type Slot = {
    from: string;
    to: string;
  };

  type ClinicAvailability = {
    hospital: string;
    slots: Slot[];
  };

  const [clinics, setClinics] = useState<ClinicAvailability[]>([]);


  const addClinic = () => {
    setClinics([
      ...clinics,
      { hospital: "", slots: [{ from: "", to: "" }] },
    ]);
  };

  const removeClinic = (index: number) => {
    setClinics(clinics.filter((_, i) => i !== index));
  };

  const addSlot = (clinicIndex: number) => {
    const updated = [...clinics];
    updated[clinicIndex].slots.push({ from: "", to: "" });
    setClinics(updated);
  };

  const removeSlot = (clinicIndex: number, slotIndex: number) => {
    const updated = [...clinics];
    updated[clinicIndex].slots.splice(slotIndex, 1);
    setClinics(updated);
  };

  const updateClinicName = (index: number, value: string) => {
    const updated = [...clinics];
    updated[index].hospital = value;
    setClinics(updated);
  };

  const updateSlot = (
    clinicIndex: number,
    slotIndex: number,
    field: "from" | "to",
    value: string
  ) => {
    const updated = [...clinics];
    updated[clinicIndex].slots[slotIndex][field] = value;
    setClinics(updated);
  };

  const saveAvailability = async () => {
  if (!doctor?.phone) return;

  try {
    const hospitals: Record<string, string[]> = {};

    clinics.forEach((clinic) => {
      if (!clinic.hospital) return;

      hospitals[clinic.hospital] = clinic.slots
        .filter((s) => s.from && s.to)
        .map((s) => `${s.from} - ${s.to}`);
    });

    await doctorAvailabilityAPI.setTodayAvailability({
      phone: doctor.phone,
      hospitals,
    });

    alert("Availability saved successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to save availability");
  }
};



  useEffect(() => {
    const fetchAvailability = async () => {
      if (!doctor?.phone) return;

      try {
        const res = await doctorAvailabilityAPI.getTodayAvailability(
          doctor.phone
        );

        if (!res.data.availability) {
          setClinics([]);
          return;
        }

        const hospitals = res.data.availability.hospitals;

        const formatted: ClinicAvailability[] = Object.entries(hospitals).map(
          ([hospital, slots]) => ({
            hospital,
            slots: (slots as string[]).map((s) => {
              const [from, to] = s.split(" - ");
              return { from, to };
            }),
          })
        );

        setClinics(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAvailability();
  }, [doctor?.phone]);


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


      {/* ================= AVAILABILITY ================= */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Accent */}
        <div className="h-2 bg-gradient-to-r from-teal-500 to-cyan-500" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Today’s Availability
              </h2>
              <p className="text-sm text-gray-500">
                Set hospital-wise consultation slots
              </p>
            </div>

            <button
              onClick={addClinic}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-600 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
            >
              <Plus className="h-4 w-4" />
              Add Hospital
            </button>
          </div>

          {/* Empty State */}
          {clinics.length === 0 && (
            <div className="text-sm text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6 text-center">
              No availability set for today
            </div>
          )}

          {/* Clinics */}
          <div className="space-y-4">
            {clinics.map((clinic, clinicIndex) => (
              <div
                key={clinicIndex}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4 hover:bg-white hover:shadow-md transition"
              >
                {/* Hospital Header */}
                <div className="flex items-center gap-3">
                  <Hospital className="h-4 w-4 text-teal-600" />

                  <input
                    type="text"
                    value={clinic.hospital}
                    onChange={(e) =>
                      updateClinicName(clinicIndex, e.target.value)
                    }
                    placeholder="Hospital / Clinic name"
                    className="flex-1 rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />

                  <button
                    onClick={() => removeClinic(clinicIndex)}
                    className="text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Slots */}
                <div className="space-y-3">
                  {clinic.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className="flex flex-wrap items-center gap-3"
                    >
                      <Clock className="h-4 w-4 text-gray-500" />

                      <input
                        type="time"
                        value={slot.from}
                        onChange={(e) =>
                          updateSlot(
                            clinicIndex,
                            slotIndex,
                            "from",
                            e.target.value
                          )
                        }
                        className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />

                      <span className="text-gray-500">to</span>

                      <input
                        type="time"
                        value={slot.to}
                        onChange={(e) =>
                          updateSlot(
                            clinicIndex,
                            slotIndex,
                            "to",
                            e.target.value
                          )
                        }
                        className="rounded-lg border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                      />

                      {clinic.slots.length > 1 && (
                        <button
                          onClick={() =>
                            removeSlot(clinicIndex, slotIndex)
                          }
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={() => addSlot(clinicIndex)}
                    className="text-sm text-teal-600 hover:text-teal-700"
                  >
                    + Add Slot
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={saveAvailability}
              className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              <Save className="h-4 w-4" />
              Save Availability
            </button>
          </div>
        </div>
      </div>
      {/* ================= END ================= */}



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


    </div>
  );
};

export default DoctorDashboard;
