import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";

interface Patient {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  doctorName: string;
}

const AdminViewPatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // TODO: Replace with real API call
    setPatients([
      { _id: "1", name: "Aditi Sharma", email: "aditi@example.com", mobile: "9876543210", doctorName: "Dr. Ravi Kumar" },
      { _id: "2", name: "Manoj Verma", email: "manoj@example.com", mobile: "9865321470", doctorName: "Dr. Priya Menon" },
      { _id: "3", name: "Rohit Nair", email: "rohit@example.com", mobile: "9988776655", doctorName: "Dr. Farhan Ali" },
    ]);
  }, []);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-xl text-white">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8" /> All Patients
        </h1>
        <p className="text-blue-100 mt-2">Patients mapped to doctors</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-700">
              <th className="py-3 px-2">Patient Name</th>
              <th className="py-3 px-2">Email</th>
              <th className="py-3 px-2">Mobile</th>
              <th className="py-3 px-2">Doctor Name</th>
            </tr>
          </thead>

          <tbody>
            {patients.map((p) => (
              <tr
                key={p._id}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="py-3 px-2 font-semibold text-gray-800">{p.name}</td>
                <td className="py-3 px-2">{p.email}</td>
                <td className="py-3 px-2">{p.mobile}</td>
                <td className="py-3 px-2 text-indigo-600 font-medium">{p.doctorName}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {patients.length === 0 && (
          <p className="text-center text-gray-600 py-6">No patients found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminViewPatients;
