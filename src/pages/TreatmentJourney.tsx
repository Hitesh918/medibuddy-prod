import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../contexts/LocationContext";
import api from "../services/api";
import {
  Search,
  MapPin,
  Star,
  Navigation,
  Loader2,
  Users,
  Building,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

// --- Type Interfaces (from original code to fix errors) ---
interface Treatment {
  _id: string;
  name: string;
  department: string;
  category: string;
  description: string;
  procedures: Array<{
    name: string;
    description: string;
    duration: string;
    complexity: string;
    isMinimallyInvasive: boolean;
  }>;
  pricing: {
    minPrice: number;
    maxPrice: number;
    currency: string;
    factors: string[];
  };
  duration: { procedure: string; hospital: string; recovery: string };
  successRate: number;
  risks: string[];
  symptoms: string[];
}
interface Hospital {
  _id: string;
  name: string;
  location: {
    city: string;
    state: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  rating: { value: number; total_reviews: number };
  distance: number;
  type: string;
  specialty?: string;
}
interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  designation?: string;
  experience_years?: number;
  experience?: string;
  rating?: { value: number; total_reviews: number };
  consultation_fee?: number;
  isVirtual?: boolean;
  hospital?: { id: string; name: string; location: any; distance: number };
  image_url?: string;
}

// --- Main Treatment Journey Component ---
const TreatmentJourney: React.FC = () => {
  const navigate = useNavigate();
  const {
    userLocation,
    isLoadingLocation,
    locationError,
    getCurrentLocation,
    clearLocationError,
  } = useLocation();

  const [step, setStep] = useState<
    "search" | "treatment-details" | "hospitals" | "doctors"
  >("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(
    null
  );
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");
  const [treatmentsBySpecialization, setTreatmentsBySpecialization] = useState<
    Treatment[]
  >([]);
  const [showSpecializationDropdown, setShowSpecializationDropdown] =
    useState(false);
  const [showTreatmentDropdown, setShowTreatmentDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userLocation && !isLoadingLocation && !locationError) {
      setShowLocationPrompt(true);
    }
    const fetchInitialData = async () => {
      try {
        const response = await api.get("/treatments/specializations");
        setSpecializations(response.data.specializations);
      } catch (error) {
        console.error("Error fetching specializations:", error);
      }
    };
    fetchInitialData();
  }, [userLocation, isLoadingLocation, locationError]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowSpecializationDropdown(false);
        setShowTreatmentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocationRequest = async () => {
    try {
      clearLocationError();
      setShowLocationPrompt(false);
      await getCurrentLocation();
    } catch (error) {
      console.error("Failed to get location:", error);
    }
  };

  const fetchTreatmentsBySpecialization = async (specialization: string) => {
    try {
      setLoading(true);
      const response = await api.get(
        `/treatments/by-specialization/${encodeURIComponent(specialization)}`
      );
      setTreatmentsBySpecialization(response.data.treatments);
    } catch (error) {
      console.error("Error fetching treatments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpecializationSelect = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setShowSpecializationDropdown(false);
    setSelectedTreatment(null);
    setTreatmentsBySpecialization([]);
    fetchTreatmentsBySpecialization(specialization);
  };

  const handleTreatmentSelect = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setShowTreatmentDropdown(false);
    setStep("treatment-details");
  };

  const handleTreatmentSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await api.get("/treatments", {
        params: { search: searchQuery, limit: 1 },
      });
      if (response.data.treatments && response.data.treatments.length > 0) {
        setSelectedTreatment(response.data.treatments[0]);
        setStep("treatment-details");
      } else {
        alert("No treatment found.");
      }
    } catch (error) {
      alert("Error searching for treatments.");
    } finally {
      setLoading(false);
    }
  };

  const findHospitals = async () => {
    if (!selectedTreatment || !userLocation) {
      alert("Please select a treatment and ensure location is enabled.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get("/hospitals/nearby", {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          specialty: selectedTreatment.category,
          radius: 20,
          limit: 10,
        },
      });
      if (response.data.hospitals && response.data.hospitals.length > 0) {
        setHospitals(response.data.hospitals);
        setStep("hospitals");
      } else {
        alert(
          `No hospitals found for ${selectedTreatment.category}. Broadening search...`
        );
        const fallbackResponse = await api.get("/hospitals", {
          params: { limit: 10 },
        });
        setHospitals(fallbackResponse.data.hospitals || []);
        setStep("hospitals");
      }
    } catch (error) {
      alert("Error finding hospitals.");
    } finally {
      setLoading(false);
    }
  };

  const selectHospital = async (hospital: Hospital) => {
    setSelectedHospital(hospital);
    setLoading(true);
    try {
      const response = await api.get(`/doctors/hospital/${hospital._id}`, {
        params: { specialty: selectedTreatment?.category },
      });
      setDoctors(response.data.doctors || []);
      setStep("doctors");
    } catch (error) {
      setDoctors([]);
      setStep("doctors");
    } finally {
      setLoading(false);
    }
  };

  // const searchHospitalsByName = async () => {
  //   if (!hospitalSearchQuery.trim()) return;
  //   setLoading(true);
  //   try {
  //     const response = await api.get("/hospitals", {
  //       params: {
  //         search: hospitalSearchQuery,
  //         specialty: selectedTreatment?.category,
  //         limit: 20,
  //       },
  //     });
  //     setHospitals(response.data.hospitals || []);
  //   } catch (error) {
  //     alert("Error searching hospitals.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const searchHospitalsByCity = async (city: string) => {
  //   setSelectedCity(city);
  //   setLoading(true);
  //   try {
  //     const response = await api.get("/hospitals", {
  //       params: {
  //         city: city,
  //         specialty: selectedTreatment?.category,
  //         limit: 20,
  //       },
  //     });
  //     setHospitals(response.data.hospitals || []);
  //   } catch (error) {
  //     alert(`Error finding hospitals in ${city}.`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const journeySteps = ["Select Treatment", "Find Hospital", "Choose Doctor"];
  // const currentStepIndex =
  //   step === "search"
  //     ? 1
  //     : step === "treatment-details"
  //     ? 1
  //     : step === "hospitals"
  //     ? 2
  //     : 3;

  const renderComponentByStep = () => {
    switch (step) {
      case "treatment-details":
        return (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <button
                onClick={() => setStep("search")}
                className="text-sm text-blue-700 font-semibold flex items-center gap-1 mb-4"
              >
                <ArrowLeft size={16} /> Back to Search
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTreatment?.name}
              </h2>
              <p className="text-sm text-gray-500">
                Category: {selectedTreatment?.category}
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              {selectedTreatment?.description}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t pt-4">
              <div>
                <p className="text-xs text-gray-500">Procedure Time</p>
                <p className="font-bold">
                  {selectedTreatment?.duration.procedure}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Hospital Stay</p>
                <p className="font-bold">
                  {selectedTreatment?.duration.hospital}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Recovery</p>
                <p className="font-bold">
                  {selectedTreatment?.duration.recovery}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="font-bold text-green-600">
                  {selectedTreatment?.successRate}%
                </p>
              </div>
            </div>
            <button
              onClick={findHospitals}
              disabled={loading}
              className="w-full h-12 rounded-lg bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-blue-800"
            >
              <MapPin size={18} /> Find Hospitals Near Me
            </button>
          </div>
        );
      case "hospitals":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 2: Find a Hospital for{" "}
                <span className="text-blue-700">{selectedTreatment?.name}</span>
              </h2>
              <button
                onClick={() => setStep("treatment-details")}
                className="text-sm text-gray-500 hover:underline mt-1"
              >
                ← Or choose a different treatment
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hospitals.map((h) => (
                  <div
                    key={h._id}
                    onClick={() => selectHospital(h)}
                    className="bg-white p-4 rounded-xl border-2 border-gray-200 flex gap-4 items-center hover:border-blue-700 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="w-20 h-20 rounded-lg bg-blue-50 flex-shrink-0 flex items-center justify-center">
                      <Building size={32} className="text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800">{h.name}</h4>
                      <p className="text-xs text-gray-500">{h.location.city}</p>
                      <div className="flex items-center gap-4 text-xs mt-2">
                        {h.rating && (
                          <span className="flex items-center gap-1">
                            <Star
                              size={12}
                              className="text-yellow-500 fill-yellow-500"
                            />{" "}
                            {h.rating.value.toFixed(1)}
                          </span>
                        )}
                        {h.distance && (
                          <span className="font-semibold text-green-600">
                            {h.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case "doctors":
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Step 3: Choose a Doctor at{" "}
                <span className="text-blue-700">{selectedHospital?.name}</span>
              </h2>
              <button
                onClick={() => setStep("hospitals")}
                className="text-sm text-gray-500 hover:underline mt-1"
              >
                ← Or choose a different hospital
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
              </div>
            ) : doctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {doctors.map((d) => (
                  <div
                    key={d._id}
                    className="bg-white p-4 rounded-xl border border-gray-200 flex gap-4 items-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center font-bold text-indigo-700 text-2xl">
                      {d.image_url ? (
                        <img
                          src={d.image_url}
                          alt={d.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        d.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800">{d.name}</h4>
                      <p className="text-sm font-medium text-blue-700">
                        {d.specialization}
                      </p>
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-3">
                        {d.rating && (
                          <span>⭐ {d.rating.value.toFixed(1)}</span>
                        )}
                        {d.experience_years && (
                          <span>{d.experience_years} yrs exp.</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        navigate("/book-consultation", {
                          state: {
                            doctor: d,
                            hospital: selectedHospital,
                            treatment: selectedTreatment,
                          },
                        })
                      }
                      className="h-10 px-4 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 bg-white rounded-xl border">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="font-semibold">No specialist doctors found</p>
                <p className="text-sm">
                  No doctors matching "{selectedTreatment?.category}" were
                  found.
                </p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Start by Selecting a Treatment
              </h3>
              <p className="text-sm text-gray-500">
                Choose a specialization and then the specific treatment you're
                looking for.
              </p>
            </div>
            <div ref={dropdownRef} className="space-y-4">
              <div className="relative">
                <button
                  onClick={() =>
                    setShowSpecializationDropdown(!showSpecializationDropdown)
                  }
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg flex items-center justify-between text-left"
                >
                  <span
                    className={
                      selectedSpecialization ? "text-gray-900" : "text-gray-500"
                    }
                  >
                    {selectedSpecialization || "1. Select a specialization..."}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      showSpecializationDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showSpecializationDropdown && (
                  <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                    {specializations.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSpecializationSelect(s)}
                        className="w-full px-4 py-2 text-left hover:bg-blue-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {selectedSpecialization && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setShowTreatmentDropdown(!showTreatmentDropdown)
                    }
                    disabled={
                      loading || treatmentsBySpecialization.length === 0
                    }
                    className="w-full h-12 px-4 border border-gray-300 rounded-lg flex items-center justify-between text-left disabled:opacity-70"
                  >
                    <span
                      className={
                        selectedTreatment ? "text-gray-900" : "text-gray-500"
                      }
                    >
                      {loading
                        ? "Loading..."
                        : selectedTreatment
                        ? selectedTreatment.name
                        : "2. Select a treatment..."}
                    </span>
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                    ) : (
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${
                          showTreatmentDropdown ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {showTreatmentDropdown &&
                    treatmentsBySpecialization.length > 0 && (
                      <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                        {treatmentsBySpecialization.map((t) => (
                          <button
                            key={t._id}
                            onClick={() => handleTreatmentSelect(t)}
                            className="w-full px-4 py-2 text-left hover:bg-blue-50 text-sm"
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase">
                Or
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Search directly for a treatment
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., heart surgery, knee replacement"
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleTreatmentSearch()
                  }
                />
                <button
                  onClick={handleTreatmentSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-700 text-white rounded-md hover:bg-blue-800 flex items-center justify-center"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {showLocationPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
            <Navigation className="h-10 w-10 text-blue-700 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Enable Location Access</h3>
            <p className="text-gray-600 my-4">
              To find the best hospitals near you, please allow location access.
              This helps us show nearby healthcare facilities and accurate
              travel times.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLocationPrompt(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Continue Without
              </button>
              <button
                onClick={handleLocationRequest}
                disabled={isLoadingLocation}
                className="flex-1 bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoadingLocation ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Getting...
                  </>
                ) : (
                  "Enable Location"
                )}
              </button>
            </div>
            {locationError && (
              <p className="text-red-600 text-sm mt-3">{locationError}</p>
            )}
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">{renderComponentByStep()}</div>
      </div>
    </>
  );
};

export default TreatmentJourney;
