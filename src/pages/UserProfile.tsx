import React, { useState, useEffect } from "react";
import { profileAPI } from "../services/api";
import {
  Phone,
  Bell,
  Sun,
  Pill,
  ShieldCheck,
  Languages,
  Loader2,
  AlertCircle,
  Droplets,
  Cake,
  HeartPulse,
  Save,
  X,
  Edit,
} from "lucide-react";

// --- Type Definitions ---
interface Reminder {
  medicine: string;
  dosage: string | null;
  frequency: string | null;
  timing_display: string | null;
  instructions: string | null;
}

interface Preferences {
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
  };
}

interface UserProfileData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  age?: string;
  blood_group?: string;
  gender?: "male" | "female" | "other";
  preferences?: Preferences;
  active_reminders?: Reminder[];
  reminders_enabled?: boolean;
  daily_tips_enabled?: boolean;
  daily_tips_delivery_time?: string;
}

// --- Reusable Components ---
const ProfileCard: React.FC<{ children: React.ReactNode; title: string }> = ({
  children,
  title,
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="space-y-5">{children}</div>
  </div>
);

const InfoRow: React.FC<{
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="h-5 w-5 text-gray-400 mr-4" />
    <div className="flex-1">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800">{value || "Not set"}</p>
    </div>
  </div>
);

// --- NEW: Modern Toggle Switch Component ---
const ToggleSwitch: React.FC<{
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const ToggleRow: React.FC<{
  icon: React.ElementType;
  label: string;
  isEnabled: boolean;
  onToggle: (field: keyof UserProfileData) => void;
  fieldName: keyof UserProfileData;
  details?: string;
}> = ({ icon: Icon, label, isEnabled, onToggle, fieldName, details }) => (
  <div className="flex items-center">
    <Icon className="h-5 w-5 text-gray-400 mr-4" />
    <div className="flex-1">
      <p className="font-medium text-gray-800">{label}</p>
      {details && <p className="text-sm text-gray-500">{details}</p>}
    </div>
    <ToggleSwitch enabled={isEnabled} onChange={() => onToggle(fieldName)} />
  </div>
);

// --- Main Profile Page Component ---
const UserProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await profileAPI.getProfile();
        setUser(response.data.user);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user profile.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleToggle = async (field: keyof UserProfileData) => {
    if (!user) return;

    const updatedValue = !user[field];
    const originalUser = { ...user }; // Backup original state

    // Optimistically update the UI
    setUser({ ...user, [field]: updatedValue });

    try {
      await profileAPI.updateProfile({ [field]: updatedValue });
    } catch (err) {
      // If API call fails, revert the state and show an error
      setUser(originalUser);
      alert(`Failed to update ${field}. Please try again.`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-600">
        <AlertCircle className="h-8 w-8 mr-2" />
        <p>{error || "User data could not be loaded."}</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-semibold">
                {user.name ? user.name.charAt(0) : "U"}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-500">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setEditModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100"
            >
              <Edit size={16} /> Edit Profile
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              {/* Personal Details */}
              <ProfileCard title="Personal Information">
                <InfoRow icon={Phone} label="Phone Number" value={user.phone} />
                <InfoRow icon={Cake} label="Age" value={`${user.age} years`} />
                <InfoRow
                  icon={Droplets}
                  label="Blood Group"
                  value={user.blood_group}
                />
                <InfoRow
                  icon={HeartPulse}
                  label="Gender"
                  value={
                    user.gender === "male"
                      ? "male"
                      : user.gender === "female"
                      ? "female"
                      : "other"
                  }
                />
              </ProfileCard>

              {/* Preferences */}
              <ProfileCard title="Settings & Preferences">
                <InfoRow
                  icon={Languages}
                  label="Language"
                  value={
                    user.preferences?.language === "en" ? "English" : "Other"
                  }
                />
                <ToggleRow
                  icon={Bell}
                  label="Email Notifications"
                  isEnabled={!!user.preferences?.notifications?.email}
                  onToggle={() => {
                    /* Add specific logic if needed */
                  }}
                  fieldName="preferences" // Dummy fieldName
                />
                <ToggleRow
                  icon={Sun}
                  label="Daily Health Tips"
                  isEnabled={!!user.daily_tips_enabled}
                  onToggle={handleToggle}
                  fieldName="daily_tips_enabled"
                  details={`Delivered at ${user.daily_tips_delivery_time}`}
                />
              </ProfileCard>
            </div>

            {/* Active Reminders */}
            <ProfileCard title="Active Medication Reminders">
              <ToggleRow
                icon={ShieldCheck}
                label="Reminders Status"
                isEnabled={!!user.reminders_enabled}
                onToggle={handleToggle}
                fieldName="reminders_enabled"
              />
              <hr />
              {user.active_reminders && user.active_reminders.length > 0 ? (
                user.active_reminders.map((reminder, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0 bg-blue-100 p-2 rounded-full">
                      <Pill className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {reminder.medicine}
                      </p>
                      <p className="text-sm text-gray-500">
                        {reminder.dosage || "As directed"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-center text-gray-500 py-4">
                  No active reminders found.
                </p>
              )}
            </ProfileCard>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditModalOpen(false)}
          onSave={(updatedUser) => {
            setUser(updatedUser);
            setEditModalOpen(false);
          }}
        />
      )}
    </>
  );
};

// --- Edit Profile Modal Component ---
const EditProfileModal: React.FC<{
  user: UserProfileData;
  onClose: () => void;
  onSave: (user: UserProfileData) => void;
}> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    age: user.age || "",
    blood_group: user.blood_group || "",
    gender: user.gender || "other",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await profileAPI.updateProfile(formData);
      onSave(response.data.user);
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-4">
            {/* Form Fields */}
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Blood Group
              </label>
              <input
                type="text"
                name="blood_group"
                value={formData.blood_group}
                onChange={handleChange}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 w-full h-10 px-3 border border-gray-300 rounded-lg bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-white border rounded-lg text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center disabled:bg-gray-400"
            >
              {isSaving ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <Save className="mr-2" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfilePage;
