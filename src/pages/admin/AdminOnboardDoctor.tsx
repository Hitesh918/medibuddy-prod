import React, { useState } from "react";
import { UserPlus, Loader2, Plus, Trash } from "lucide-react";

const specializations = [
  "Cardiology",
  "Dermatology",
  "Orthopedics",
  "Neurology",
  "Pediatrics",
  "General Medicine",
];

const hospitals = [
  "Apollo Hospital",
  "Aster Hospital",
  "Fortis Hospital",
  "Manipal Hospital",
];

const inputStyle =
  "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none";

const AdminOnboardDoctor: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    designation: "",
    experience_years: "",
    experience_text: "",
    summary: "",
    consultation_fee: "",
    city: "",
    state: "",
    hospital_name: "",
    phone: "",
    email: "",
    imageFile: null as File | null,

    specialties: [""],
    languages: [""],
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: any) => {
    setForm({ ...form, imageFile: e.target.files[0] });
  };

  const handleArrayChange = (index: number, field: string, value: string) => {
    setForm({
      ...form,
      [field]: form[field].map((item: any, i: number) =>
        i === index ? value : item
      ),
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    alert("Doctor onboarded successfully!");
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-6">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-600 p-8 rounded-xl text-white">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <UserPlus className="h-8 w-8" />
          Onboard New Doctor
        </h1>
        <p className="text-green-100 mt-2">Add a new doctor to the system</p>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>

          {/* NAME */}
          <div>
            <label className="block text-gray-700 mb-1">Doctor Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange}
            className={inputStyle} required />
          </div>

          {/* SPECIALIZATION DROPDOWN */}
          <div>
            <label className="block text-gray-700 mb-1">Specialization</label>
            <select
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className={inputStyle + " bg-white"}
            >
              <option value="">Select specialization</option>
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* DESIGNATION */}
          <div>
            <label className="block text-gray-700 mb-1">Designation</label>
            <input type="text" name="designation" value={form.designation}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* EXPERIENCE YEARS */}
          <div>
            <label className="block text-gray-700 mb-1">Experience (Years)</label>
            <input type="number" name="experience_years" value={form.experience_years}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* EXPERIENCE TEXT */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Experience Details</label>
            <input type="text" name="experience_text" value={form.experience_text}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* SUMMARY */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Summary / Bio</label>
            <textarea
              name="summary"
              value={form.summary}
              onChange={handleChange}
              className={inputStyle + " h-24"}
            />
          </div>

          {/* IMAGE FILE */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className={inputStyle}
            />
          </div>

          {/* HOSPITAL DROPDOWN */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-1">Hospital</label>
            <select
              name="hospital_name"
              value={form.hospital_name}
              onChange={handleChange}
              className={inputStyle + " bg-white"}
            >
              <option value="">Select hospital</option>
              {hospitals.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div>
            <label className="block text-gray-700 mb-1">City</label>
            <input type="text" name="city" value={form.city}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* STATE */}
          <div>
            <label className="block text-gray-700 mb-1">State</label>
            <input type="text" name="state" value={form.state}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-gray-700 mb-1">Phone</label>
            <input type="text" name="phone" value={form.phone}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={form.email}
            onChange={handleChange} className={inputStyle} />
          </div>

          {/* CONSULTATION FEE */}
          <div>
            <label className="block text-gray-700 mb-1">Consultation Fee</label>
            <input type="number" name="consultation_fee"
            value={form.consultation_fee} onChange={handleChange}
            className={inputStyle} />
          </div>

          {/* LANGUAGES — SAME BEAUTIFUL STYLING */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2">Languages</label>

            {form.languages.map((lang, i) => (
              <div key={i} className="flex gap-3 mb-2">
                <input
                  type="text"
                  value={lang}
                  onChange={(e) => handleArrayChange(i, "languages", e.target.value)}
                  className={inputStyle + " flex-1"}
                />

                {i > 0 && (
                  <button type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      languages: form.languages.filter((_, idx) => idx !== i),
                    })
                  }>
                    <Trash className="h-5 w-5 text-red-500" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => setForm({ ...form, languages: [...form.languages, ""] })}
              className="text-sm text-green-600 flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Language
            </button>
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg 
                         hover:bg-green-700 transition flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5" /> Add Doctor
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AdminOnboardDoctor;
