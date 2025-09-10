import React, { useState, useEffect, useCallback } from "react";
import { treatmentsAPI } from "../services/api";
import api from "../services/api";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Star,
  Award,
  AlertCircle,
  Info,
  Stethoscope,
  Building,
  ChevronLeft,
  ChevronRight,
  Shield,
  Lightbulb,
} from "lucide-react";
import type { TreatmentPlan, ApiError } from "../types/treatmentPlanner";

// --- Type Interfaces (from original code) ---
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
  urgencyLevel: string;
  ageGroup?: { min: number; max: number };
}

// --- Reusable UI Components for Consistency ---
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

// const FormattedAiTips: React.FC<{ text: string }> = ({ text }) => {
//   const lines = text.split("\n").filter((line) => line.trim() !== "");
//   const renderLine = (line: string, index: number) => {
//     if (line.startsWith("## ")) {
//       return (
//         <div key={index} className="flex items-center gap-3 mt-6 mb-3">
//           <div className="bg-blue-100 p-2 rounded-full">
//             <HeartPulse size={20} className="text-blue-700" />
//           </div>
//           <h2 className="text-xl font-bold text-gray-800">
//             {line.substring(3)}
//           </h2>
//         </div>
//       );
//     }
//     if (line.startsWith("**") && line.endsWith("**")) {
//       return (
//         <p key={index} className="font-semibold text-gray-700 my-2">
//           {line.substring(2, line.length - 2)}
//         </p>
//       );
//     }
//     if (line.startsWith("* ")) {
//       return (
//         <li key={index} className="flex gap-3 items-start">
//           <CheckCircle
//             size={16}
//             className="text-green-500 mt-1 flex-shrink-0"
//           />
//           <span>{line.substring(2)}</span>
//         </li>
//       );
//     }
//     return <p key={index}>{line}</p>;
//   };
//   return (
//     <div className="space-y-2 text-gray-600 leading-relaxed">
//       {lines.map(renderLine)}
//     </div>
//   );
// };

// --- Main Treatment Search Component ---
const TreatmentSearch: React.FC = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPlanner, setShowPlanner] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [insuranceType, setInsuranceType] = useState<string>("none");
  const [treatmentData, setTreatmentData] = useState<TreatmentPlan | null>(
    null
  );
  const [plannerLoading, setPlannerLoading] = useState<boolean>(false);
  const [plannerError, setPlannerError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("overview");

  const insuranceOptions = [
    { value: "none", label: "No Insurance" },
    { value: "star_health", label: "Star Health" },
    { value: "hdfc_ergo", label: "HDFC Ergo" },
    { value: "icici_lombard", label: "ICICI Lombard" },
    { value: "bajaj_allianz", label: "Bajaj Allianz" },
    { value: "other", label: "Other" },
  ];

  const fetchCategories = async () => {
    try {
      const response = await treatmentsAPI.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchTreatments = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: currentPage, limit: 9 };
      if (searchQuery) params.query = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      const response = await treatmentsAPI.search(params);
      setTreatments(response.data.treatments);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch treatments:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, currentPage]);

  useEffect(() => {
    fetchCategories();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setLocation(
            `${position.coords.latitude},${position.coords.longitude}`
          ),
        () => setLocation("Delhi, India")
      );
    }
  }, []);

  useEffect(() => {
    if (!showPlanner) fetchTreatments();
  }, [fetchTreatments, showPlanner]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTreatments();
  };

  const handlePlannerSearch = async () => {
    if (!searchQuery.trim()) {
      setPlannerError("Please enter a treatment name");
      return;
    }
    setPlannerLoading(true);
    setPlannerError("");
    try {
      const response = await api.post("/treatment-planner/analyze-treatment", {
        treatmentName: searchQuery,
        patientLocation: location,
        insuranceType,
      });
      setTreatmentData(response.data.data);
      setActiveTab("overview");
    } catch (err) {
      const error = err as ApiError;
      setPlannerError(
        error.response?.data?.error || "Failed to analyze treatment"
      );
    } finally {
      setPlannerLoading(false);
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  const getTreatmentComplexityColor = (complexity: string): string => {
    const lower = complexity?.toLowerCase();
    if (lower === "low") return "text-green-700 bg-green-50";
    if (lower === "medium") return "text-yellow-700 bg-yellow-50";
    if (lower === "high") return "text-red-700 bg-red-50";
    return "text-gray-600 bg-gray-100";
  };

  const renderPagination = () => (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="flex items-center justify-center h-10 w-10 bg-white border border-gray-300 rounded-full disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <span className="text-sm text-gray-600 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center h-10 w-10 bg-white border border-gray-300 rounded-full disabled:opacity-50 hover:bg-gray-50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="text-left">
        <h1 className="text-lg md:text-3xl font-bold text-gray-800">
          Find Your Treatment
        </h1>
        <p className="mt-2 text-gray-500 max-w-2xl ">
          Explore medical treatments or use our AI Planner for a personalized
          journey with cost analysis.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-center mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setShowPlanner(false)}
              className={`px-5 py-2 rounded-md font-semibold text-sm transition-all ${
                !showPlanner
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Browse Treatments
            </button>
            <button
              onClick={() => setShowPlanner(true)}
              className={`px-5 py-2 rounded-md font-semibold text-sm transition-all ${
                showPlanner
                  ? "bg-white text-blue-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              AI Treatment Planner
            </button>
          </div>
        </div>
        {!showPlanner ? (
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search treatments, conditions..."
                  className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full h-12 px-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Treatment or Procedure
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g., Knee replacement"
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Your Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or Pincode"
                    className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Insurance Provider
                </label>
                <select
                  value={insuranceType}
                  onChange={(e) => setInsuranceType(e.target.value)}
                  className="w-full h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Insurance</option>
                  {insuranceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-center">
              <button
                onClick={handlePlannerSearch}
                disabled={plannerLoading || !searchQuery.trim()}
                className="h-12 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 text-white px-8 rounded-lg font-semibold text-md transition-colors flex items-center justify-center mx-auto min-w-[240px]"
              >
                {plannerLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>{" "}
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" /> Get Treatment Plan
                  </>
                )}
              </button>
            </div>
            {plannerError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                <AlertCircle size={16} />
                {plannerError}
              </div>
            )}
          </div>
        )}
      </div>

      {!showPlanner ? (
        loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : treatments.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatments.map((treatment) => (
                <div
                  key={treatment._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-lg hover:border-blue-300 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {treatment.name}
                      </h3>
                      <span className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full font-medium">
                        {treatment.category}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                      {treatment.description}
                    </p>
                  </div>
                  <div className="text-sm space-y-2 border-t pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-green-500" />
                      <span className="text-gray-600">Avg. Cost:</span>
                      <span className="font-semibold">
                        {formatCurrency(
                          (treatment.pricing.minPrice +
                            treatment.pricing.maxPrice) /
                            2
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-blue-500" />
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-semibold">
                        {treatment.duration.procedure}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-yellow-500" />
                      <span className="text-gray-600">Success Rate:</span>
                      <span className="font-semibold">
                        {treatment.successRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && renderPagination()}
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800">
              No treatments found
            </h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </div>
        )
      ) : (
        treatmentData && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Your Personalized Plan for{" "}
                <span className="text-blue-700">
                  {treatmentData.treatment.name}
                </span>
              </h2>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex overflow-x-auto -mb-px">
                  {[
                    { id: "overview", label: "Overview", icon: Info },
                    { id: "costs", label: "Cost Analysis", icon: DollarSign },
                    { id: "hospitals", label: "Hospitals", icon: Building },
                    { id: "doctors", label: "Doctors", icon: Award },
                    {
                      id: "recommendations",
                      label: "AI Recommendations",
                      icon: Lightbulb,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-blue-700 text-blue-700"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* <div className="lg:col-span-2">
                      <InfoCard
                        icon={
                          <BriefcaseMedical
                            size={20}
                            className="text-blue-700"
                          />
                        }
                        title="Treatment Details"
                      >
                        <p>{treatmentData.treatment.details.description}</p>
                      </InfoCard>
                    </div> */}
                    <div className="space-y-6">
                      <InfoCard
                        icon={<Clock size={20} className="text-blue-600" />}
                        title="Estimated Duration"
                      >
                        <p className="text-2xl font-bold text-gray-800">
                          {treatmentData.treatment.details.duration}
                        </p>
                      </InfoCard>
                      <InfoCard
                        icon={<Shield size={20} className="text-indigo-600" />}
                        title="Complexity"
                      >
                        <p
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTreatmentComplexityColor(
                            treatmentData.treatment.details.complexity
                          )}`}
                        >
                          {treatmentData.treatment.details.complexity}
                        </p>
                      </InfoCard>
                    </div>
                  </div>
                )}
                {activeTab === "costs" && (
                  <div className="space-y-4">
                    {treatmentData.costs.sources.map((cost, i) => (
                      <div key={i} className="p-4 rounded-lg bg-gray-100">
                        <h4 className="font-semibold text-gray-800">
                          {cost.source} ({cost.hospitalType})
                        </h4>
                        <p className="text-sm text-green-600 font-bold">
                          {formatCurrency(cost.priceRange.min)} -{" "}
                          {formatCurrency(cost.priceRange.max)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {cost.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "hospitals" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {treatmentData.hospitals.map((h) => (
                      <div key={h.id} className="p-4 rounded-lg bg-gray-100">
                        <h4 className="font-semibold text-gray-800">
                          {h.name}
                        </h4>
                        <p className="text-xs text-gray-500">{h.address}</p>
                        <div className="flex items-center gap-4 text-xs mt-2">
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" />{" "}
                            {h.rating}
                          </span>
                          <span className="font-semibold text-green-600">
                            {h.distance}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "doctors" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {treatmentData.doctors.map((d) => (
                      <div key={d.id} className="p-4 rounded-lg bg-gray-100">
                        <h4 className="font-semibold text-gray-800">
                          {d.name}, {d.qualification}
                        </h4>
                        <p className="text-sm text-blue-700 font-medium">
                          {d.specialization}
                        </p>
                        <p className="text-xs text-gray-500">{d.hospital}</p>
                        <div className="flex items-center gap-4 text-xs mt-2">
                          <span className="flex items-center gap-1">
                            <Star size={12} className="text-yellow-500" />{" "}
                            {d.rating}
                          </span>
                          <span>{d.experience} Exp.</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === "recommendations" && (
                  <div>
                    {/* <InfoCard
                      icon={<Lightbulb size={20} className="text-yellow-500" />}
                      title="AI Recommendations"
                    >
                      <FormattedAiTips
                        text={treatmentData.recommendations.aiRecommendations}
                      />
                    </InfoCard> */}
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      <InfoCard
                        icon={<Award size={20} className="text-green-600" />}
                        title="Top Hospital Picks"
                      >
                        <div className="space-y-3">
                          {treatmentData.recommendations.topHospitalPicks.map(
                            (p, i) => (
                              <div key={i}>
                                <p className="font-semibold text-gray-800">
                                  {p.name}
                                </p>
                                <p className="text-xs">{p.reason}</p>
                              </div>
                            )
                          )}
                        </div>
                      </InfoCard>
                      <InfoCard
                        icon={
                          <DollarSign size={20} className="text-teal-600" />
                        }
                        title="Budget Options"
                      >
                        <div className="space-y-3">
                          {treatmentData.recommendations.budgetOptions.map(
                            (p, i) => (
                              <div key={i}>
                                <p className="font-semibold text-gray-800">
                                  {p.name}
                                </p>
                                <p className="text-xs">{p.cost}</p>
                              </div>
                            )
                          )}
                        </div>
                      </InfoCard>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TreatmentSearch;
