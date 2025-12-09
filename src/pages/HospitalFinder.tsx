import React, { useState, useEffect, useCallback } from "react";
import { locationAPI, hospitalAPI } from "../services/api";
import {
  MapPin,
  Search,
  Phone,
  Navigation,
  Star,
  Building2,
  Award,
  AlertCircle,
  Loader2,
  X,
  Globe,
  Shield,
  Bed,
  BriefcaseMedical,
  Calendar,
  HeartPulse,
  Info,
} from "lucide-react";

// --- Type Interfaces Updated to Match API Response ---
interface Hospital {
  _id: string;
  name: string;
  rating?: { value: number; total_reviews: number };
  image_url?: string;
  established_year?: number;
  bed_count?: number;
  specialty?: string;
  location: {
    country: string;
    city: string;
    state: string;
    address: string;
    pincode: string;
    area: string;
    coordinates: { lat: number; lng: number };
  };
  description?: string;
  contact: { phone: string[]; email: string; website: string };
  facilities: string[];
  departments?: string[];
  doctors: Doctor[];
  is_verified?: boolean;
  distance?: number;
  type?: string;
}

interface DetailedHospital extends Hospital {
  ratings?: {
    overall: number;
    cleanliness?: number;
    staff?: number;
    facilities?: number;
    treatment?: number;
    totalReviews?: number;
  };
  specialties?: Array<{
    name: string;
    description?: string;
    certifications?: string[];
  }>;
  accreditations?: Array<{
    name: string;
    issuedBy?: string;
    validUntil?: string;
    certificateNumber?: string;
  }>;
  insurance?: string[];
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  designation?: string;
  experience_years?: number;
  experience_text?: string;
  rating?: { value: number; total_reviews: number };
  location?: { city: string; state: string };
  contact?: { phone?: string[]; email?: string };
  education?: Array<{ degree: string; institution: string; year?: number }>;
  image_url?: string;
  bio?: string;
  availableSlots?: Array<{
    day: string;
    slots: Array<{ time: string; available: boolean }>;
  }>;
}

interface UserLocation {
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  address: string;
}

// --- Reusable UI Components ---
const renderStars = (rating?: number, size = 16) => {
  const r = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={`${i < r ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
};

const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className }) => (
  <div
    className={`bg-white p-6 rounded-xl border border-gray-200 shadow-sm ${className}`}
  >
    <div className="flex items-center gap-4 mb-4">
      <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
      {children}
    </div>
  </div>
);

// --- Main Hospital Finder Component ---
const HospitalFinder: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [_userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [_currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedHospital, setSelectedHospital] =
    useState<DetailedHospital | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [searchRadius, _setSearchRadius] = useState(10);

  const specialties = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
    "General Surgery",
  ];

  const fetchHospitals = useCallback(
    async (lat: number, lng: number) => {
      setLoading(true);
      setError("");
      try {
        const response = await locationAPI.getNearbyHospitals(
          lat,
          lng,
          searchRadius,
          selectedSpecialty || undefined,
          20
        );
        let hospitalData = response.data.hospitals || [];
        if (selectedSpecialty) {
          hospitalData = hospitalData.filter((h: Hospital) =>
            h.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase())
          );
        }
        setHospitals(hospitalData);
      } catch (error) {
        setError("Failed to fetch hospitals. Please try again.");
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    },
    [searchRadius, selectedSpecialty]
  );

  const detectUserLocation = useCallback(async () => {
    setLoading(true);
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await locationAPI.reverseGeocode(latitude, longitude);
          const loc = res.data;
          setUserLocation({
            city: loc.city,
            region: loc.state,
            country: loc.country,
            lat: latitude,
            lng: longitude,
            address: loc.address,
          });
          setCurrentCoords({ lat: latitude, lng: longitude });
          setSearchLocation(loc.city);
          await fetchHospitals(latitude, longitude);
        } catch {
          setUserLocation({
            city: "Current Location",
            region: "",
            country: "",
            lat: latitude,
            lng: longitude,
            address: "Unknown Address",
          });
          setCurrentCoords({ lat: latitude, lng: longitude });
          setSearchLocation("Current Location");
          await fetchHospitals(latitude, longitude);
        }
      },
      () => {
        setError(
          "Location access denied. Please enable it or search manually."
        );
        setLoading(false);
      }
    );
  }, [fetchHospitals]);

  useEffect(() => {
    detectUserLocation();
  }, [detectUserLocation]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchLocation.trim()) {
      setError("Please enter a location.");
      return;
    }
    setLoading(true);
    try {
      const res = await locationAPI.geocode(searchLocation);
      const { latitude, longitude } = res.data.coordinates;
      setCurrentCoords({ lat: latitude, lng: longitude });
      await fetchHospitals(latitude, longitude);
    } catch {
      setError("Could not find the specified location. Please try another.");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalClick = async (hospitalId: string) => {
    setLoading(true);
    try {
      const response = await hospitalAPI.getHospitalDetails(hospitalId);
      setSelectedHospital(response.data.hospital);
    } catch {
      setError("Failed to load hospital details.");
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (hospital: DetailedHospital) => {
    const { lat, lng } = hospital.location.coordinates;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      "_blank"
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Hospital Finder</h1>
        <p className="mt-1 text-gray-500">
          Find trusted hospitals and medical facilities near you.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
        >
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="City, Area, or Pincode"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Specialty
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Specialties</option>
              {specialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search size={18} />
            )}
            <span>Search</span>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      <div>
        {loading && !hospitals.length ? (
          <div className="text-center py-16 text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin text-blue-700 mx-auto" />
            <p className="mt-2">Finding hospitals...</p>
          </div>
        ) : hospitals.length > 0 ? (
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <div
                key={hospital._id}
                onClick={() => handleHospitalClick(hospital._id)}
                className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-5 p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
              >
                <img
                  src={hospital.image_url}
                  alt={hospital.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://placehold.co/400x400/e2e8f0/64748b?text=Image")
                  }
                />
                <div className="flex flex-col flex-1">
                  {hospital.specialty && (
                    <span className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full font-medium self-start">
                      {hospital.specialty}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-800 mt-1 text-lg">
                    {hospital.name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                    <MapPin size={12} />
                    {hospital.location.city}, {hospital.location.state}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {hospital.rating && hospital.rating.value > 0 && (
                      <div className="flex items-center gap-2">
                        {renderStars(hospital.rating.value, 14)}
                        <span className="font-semibold">
                          {hospital.rating.value.toFixed(1)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          ({hospital.rating.total_reviews})
                        </span>
                      </div>
                    )}
                    {typeof hospital.bed_count === "number" &&
                      hospital.bed_count > 0 && (
                        <div className="flex items-center gap-1.5">
                          <Bed size={14} className="text-gray-400" />
                          <span>{hospital.bed_count} Beds</span>
                        </div>
                      )}
                  </div>
                  <div className="mt-auto pt-3 flex justify-end">
                    {hospital.distance && (
                      <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">{`${hospital.distance.toFixed(
                        1
                      )} km away`}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            <Building2 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="font-semibold">No hospitals found</p>
            <p className="text-sm">Try a different location or filter.</p>
          </div>
        )}
      </div>

      {selectedHospital && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedHospital(null)}
        >
          <div
            className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 sm:p-6 border-b flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedHospital.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {selectedHospital.location.address}
                </p>
              </div>
              <button
                onClick={() => setSelectedHospital(null)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto">
              {selectedHospital.image_url && (
                <img
                  src={selectedHospital.image_url}
                  alt={selectedHospital.name}
                  className="w-full h-56 object-cover rounded-xl"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                  <p>
                    <span className="font-bold">
                      {selectedHospital.rating?.value?.toFixed(1) || "N/A"}
                    </span>{" "}
                    ({selectedHospital.rating?.total_reviews} reviews)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <BriefcaseMedical className="h-6 w-6 text-blue-700 flex-shrink-0" />
                  <p>
                    <span className="font-bold">
                      {selectedHospital.specialty}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="h-6 w-6 text-indigo-500 flex-shrink-0" />
                  <p>
                    <span className="font-bold">
                      {selectedHospital.bed_count}
                    </span>{" "}
                    Beds
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-teal-500 flex-shrink-0" />
                  <p>
                    Est.{" "}
                    <span className="font-bold">
                      {selectedHospital.established_year}
                    </span>
                  </p>
                </div>
              </div>
              {selectedHospital.description && (
                <InfoCard
                  icon={<Info size={20} className="text-blue-700" />}
                  title="About"
                >
                  <p>{selectedHospital.description}</p>
                </InfoCard>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                {selectedHospital.specialties &&
                  selectedHospital.specialties.length > 0 && (
                    <InfoCard
                      icon={
                        <HeartPulse size={20} className="text-indigo-600" />
                      }
                      title="Specialties"
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.specialties.map((s) => (
                          <span
                            key={s.name}
                            className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-medium"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </InfoCard>
                  )}
                {selectedHospital.facilities &&
                  selectedHospital.facilities.length > 0 && (
                    <InfoCard
                      icon={<Award size={20} className="text-teal-600" />}
                      title="Facilities"
                    >
                      <ul className="list-disc list-inside grid grid-cols-2 gap-x-4 gap-y-1">
                        {selectedHospital.facilities.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </InfoCard>
                  )}
                {selectedHospital.accreditations &&
                  selectedHospital.accreditations.length > 0 && (
                    <InfoCard
                      icon={<Shield size={20} className="text-green-600" />}
                      title="Accreditations"
                    >
                      <ul className="list-disc list-inside">
                        {selectedHospital.accreditations.map((a, i) => (
                          <li key={i}>{a.name}</li>
                        ))}
                      </ul>
                    </InfoCard>
                  )}
                {selectedHospital.insurance &&
                  selectedHospital.insurance.length > 0 && (
                    <InfoCard
                      icon={
                        <span className="inline-block w-5 h-5 bg-orange-100 text-orange-700 rounded-full text-center text-xs font-semibold">
                          I
                        </span>
                      }
                      title="Insurance Accepted"
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.insurance.map((ins, i) => (
                          <span
                            key={i}
                            className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-medium"
                          >
                            {ins}
                          </span>
                        ))}
                      </div>
                    </InfoCard>
                  )}
              </div>
              {selectedHospital.doctors &&
                selectedHospital.doctors.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      Doctors ({selectedHospital.doctors.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedHospital.doctors.map((d) => (
                        <div
                          key={d._id}
                          className="bg-gray-100 p-4 rounded-lg flex gap-4"
                        >
                          <div className="w-16 h-16 rounded-full bg-blue-200 flex-shrink-0 flex items-center justify-center font-bold text-blue-700 text-2xl">
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
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {d.name}
                            </h4>
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
            <div className="p-4 border-t flex flex-col sm:flex-row justify-end items-center gap-4 bg-gray-100/50 rounded-b-2xl">
              {selectedHospital.contact?.phone?.[0] && (
                <a
                  href={`tel:${selectedHospital.contact.phone[0]}`}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Phone size={14} /> {selectedHospital.contact.phone[0]}
                </a>
              )}
              {selectedHospital.contact?.website && (
                <a
                  href={selectedHospital.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700"
                >
                  <Globe size={14} /> Website
                </a>
              )}
              <button
                onClick={() => openDirections(selectedHospital)}
                className="w-full sm:w-auto h-11 px-5 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation size={16} /> Get Directions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalFinder;
