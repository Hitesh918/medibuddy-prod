import React, { useEffect, useState } from "react";
import { UserCog } from "lucide-react";

interface Doctor {
  _id: string;
  name: string;
  email: string;
  specialization: string;
  experience: number;
  hospital: string;
}

const AdminViewDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    setDoctors([
      { _id: "1", name: "Dr. Ravi Kumar", email: "ravi@hospital.com", specialization: "Cardiology", experience: 8, hospital: "Apollo" },
      { _id: "2", name: "Dr. Priya Menon", email: "priya@hospital.com", specialization: "Dermatology", experience: 5, hospital: "Fortis" },
      { _id: "3", name: "Dr. Farhan Ali", email: "farhan@hospital.com", specialization: "Orthopedics", experience: 7, hospital: "Aster" },
    ]);
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-xl text-white">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserCog className="h-8 w-8" /> All Doctors
        </h1>
        <p className="text-purple-100 mt-2">Manage registered doctors</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="py-3 px-2">Doctor Name</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Specialization</th>
              <th className="py-3 px-2">Experience</th>
              <th className="py-3 px-2">Hospital</th>
            </tr>
          </thead>

          <tbody>
            {doctors.map((d) => (
              <tr
                key={d._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-2 font-semibold text-gray-800">{d.name}</td>
                <td className="py-3 px-2">{d.email}</td>
                <td className="py-3 px-2">{d.specialization}</td>
                <td className="py-3 px-2">{d.experience} years</td>
                <td className="py-3 px-2">{d.hospital}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {doctors.length === 0 && (
          <p className="text-center text-gray-600 py-6">No doctors found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminViewDoctors;
