import React, { useState, useEffect } from "react";
import { aiAPI } from "../services/api";
import {
  Plus,
  X,
  AlertCircle,
  CheckCircle,
  Brain,
  Stethoscope,
  ArrowLeft,
  Clock,
  Info,
  Users,
  Pill,
  Sparkles,
} from "lucide-react";

// --- Type Interfaces (from original code) ---
interface AnalysisResult {
  possibleConditions: Array<{
    condition: string;
    probability: number;
    description: string;
  }>;
  recommendations: string[];
  urgencyLevel: "low" | "medium" | "high";
  disclaimer: string;
}
interface DiseaseInfo {
  disease: {
    name: string;
    description: string;
    commonCauses: string[];
    commonSymptoms: string[];
    severity: string;
    urgencyLevel: string;
  };
  recommendations: {
    immediateSteps: string[];
    lifestyle: string[];
    prevention: string[];
    whenToSeeDoctor: string;
  };
  medications: {
    overTheCounter: Array<{
      name: string;
      purpose: string;
      generalDosage: string;
      precautions: string[];
      safetyNote: string;
      disclaimer: string;
    }>;
    prescriptionNote: string;
  };
  warnings: string[];
  followUp: {
    timeframe: string;
    redFlags: string[];
  };
  medicalDisclaimer: {
    primary: string;
    secondary: string;
    emergency: string;
  };
  recommendedSpecialties: string[];
}
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  qualification: string;
  rating: string;
  consultationFee: string;
  distance: string;
  image?: string;
  hospital: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    rating: string;
    contact?: any;
  };
}
interface UserLocation {
  lat: number;
  lng: number;
  city?: string;
  region?: string;
  country?: string;
  source?: string;
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

const UrgencyBanner: React.FC<{ level: "low" | "medium" | "high" }> = ({
  level,
}) => {
  const config = {
    low: {
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      iconColor: "text-green-600",
      text: "Urgency Level: Low",
    },
    medium: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-600",
      text: "Urgency Level: Medium",
    },
    high: {
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      textColor: "text-red-800",
      iconColor: "text-red-600",
      text: "Urgency Level: High",
    },
  };
  const { bgColor, borderColor, textColor, iconColor, text } =
    config[level] || config.low;
  return (
    <div
      className={`p-4 rounded-lg border flex items-center gap-3 ${bgColor} ${borderColor}`}
    >
      <AlertCircle className={`h-5 w-5 ${iconColor}`} />
      <p className={`font-semibold text-sm ${textColor}`}>{text}</p>
    </div>
  );
};

const SymptomChecker: React.FC = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null);
  const [loadingDiseaseInfo, setLoadingDiseaseInfo] = useState(false);
  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [showDoctors, setShowDoctors] = useState(false);

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const response = await aiAPI.getUserLocation();
        if (response.data.success && response.data.location) {
          setUserLocation(response.data.location);
        }
      } catch (error) {
        console.warn("Could not get user location:", error);
      }
    };
    getUserLocation();
  }, []);

  const addSymptom = () => {
    if (currentSymptom.trim() && !symptoms.includes(currentSymptom.trim())) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom("");
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      setError("Please add at least one symptom.");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    setSelectedDisease(null);
    setDiseaseInfo(null);
    try {
      const response = await aiAPI.analyzeSymptoms(
        symptoms,
        additionalInfo,
        userLocation
      );
      setResult(response.data.analysis);
    } catch (err: any) {
      setError("Failed to analyze symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDiseaseClick = async (diseaseName: string) => {
    setSelectedDisease(diseaseName);
    setLoadingDiseaseInfo(true);
    setDiseaseInfo(null);
    setRecommendedDoctors([]);
    setShowDoctors(false);
    try {
      const response = await aiAPI.getDiseaseDetails(
        diseaseName,
        symptoms,
        userLocation
      );
      if (response.data.success) {
        setDiseaseInfo(response.data.diseaseInfo);
        setRecommendedDoctors(response.data.recommendations.doctors || []);
      } else {
        setError("Failed to get disease information");
      }
    } catch (err: any) {
      setError("Failed to get disease details. Please try again.");
    } finally {
      setLoadingDiseaseInfo(false);
    }
  };

  const goBackToResults = () => {
    setSelectedDisease(null);
    setDiseaseInfo(null);
    setShowDoctors(false);
  };

  const resetChecker = () => {
    setSymptoms([]);
    setCurrentSymptom("");
    setAdditionalInfo("");
    setResult(null);
    setError("");
    setSelectedDisease(null);
    setDiseaseInfo(null);
  };

  const getTagColors = (text: string, type: "severity" | "urgency") => {
    const lowerText = text?.toLowerCase() || "";
    if (type === "severity") {
      if (lowerText.includes("serious")) return "bg-red-100 text-red-700";
      if (lowerText.includes("moderate"))
        return "bg-yellow-100 text-yellow-700";
      if (lowerText.includes("mild")) return "bg-green-100 text-green-700";
    }
    if (type === "urgency") {
      if (lowerText.includes("urgent")) return "bg-red-100 text-red-700";
      if (lowerText.includes("prompt")) return "bg-yellow-100 text-yellow-700";
      if (lowerText.includes("routine")) return "bg-green-100 text-green-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  const renderSymptomInput = () => (
    // --- CHANGE: Redesigned initial input view ---
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">AI Symptom Checker</h1>
        <p className="mt-2 text-gray-500">
          Describe your symptoms to get AI-powered health insights instantly.
        </p>
      </div>
      <div className="space-y-6">
        <div>
          <label
            htmlFor="symptom-input"
            className="block text-md font-semibold text-gray-700 mb-2"
          >
            Add Your Symptoms
          </label>
          <div className="flex gap-3">
            <input
              id="symptom-input"
              type="text"
              value={currentSymptom}
              onChange={(e) => setCurrentSymptom(e.target.value)}
              placeholder="e.g., headache, fever, cough"
              onKeyPress={(e) => e.key === "Enter" && addSymptom()}
              className="flex-1 w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addSymptom}
              className="h-12 px-5 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 flex items-center gap-2 transition-colors"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {symptoms.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className="flex items-center gap-2 pl-3 pr-2 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
              >
                <span>{symptom}</span>
                <button
                  onClick={() => removeSymptom(index)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div>
          <label
            htmlFor="additional-info"
            className="block text-md font-semibold text-gray-700 mb-2"
          >
            Additional Information (Optional)
          </label>
          <textarea
            id="additional-info"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="Describe duration, severity, triggers, etc."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <button
            onClick={handleAnalyze}
            disabled={loading || symptoms.length === 0}
            className="w-full h-12 rounded-lg bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles size={18} /> Analyze Symptoms
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAnalysisResults = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Analysis Results</h1>
        <p className="mt-2 text-gray-500">
          Here are the potential conditions based on your symptoms.
        </p>
      </div>
      <div className="space-y-4">
        {result?.possibleConditions?.map((condition) => (
          <div
            key={condition.condition}
            className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-800">
                  {condition.condition}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {condition.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-800">
                  {Math.round(condition.probability)}%
                </p>
                <p className="text-xs text-gray-500">Match</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 my-4">
              <div
                className="bg-blue-700 h-2 rounded-full"
                style={{ width: `${condition.probability}%` }}
              ></div>
            </div>
            {/* --- CHANGE: Added dedicated button --- */}
            <div className="text-right">
              <button
                onClick={() => handleDiseaseClick(condition.condition)}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold text-sm hover:bg-blue-800 transition-colors"
              >
                View Full Detailed Analysis
              </button>
            </div>
          </div>
        ))}
      </div>
      {result?.urgencyLevel && (
        <div className="mt-6">
          <UrgencyBanner level={result.urgencyLevel} />
        </div>
      )}
      {result?.disclaimer && (
        <div className="mt-6 p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border">
          <strong>Disclaimer:</strong> {result.disclaimer}
        </div>
      )}
      <div className="mt-8 text-center">
        <button
          onClick={resetChecker}
          className="text-sm text-gray-500 hover:underline"
        >
          Start a new analysis
        </button>
      </div>
    </div>
  );

  const renderDiseaseDetails = () => (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={goBackToResults}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-700 font-semibold mb-6"
      >
        <ArrowLeft size={16} /> Back to Results
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {diseaseInfo?.disease.name}
      </h1>
      <div className="flex flex-wrap gap-3 mb-8">
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getTagColors(
            diseaseInfo?.disease.severity || "",
            "severity"
          )}`}
        >
          Severity: {diseaseInfo?.disease.severity}
        </span>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${getTagColors(
            diseaseInfo?.disease.urgencyLevel || "",
            "urgency"
          )}`}
        >
          Urgency: {diseaseInfo?.disease.urgencyLevel}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            icon={<Info size={20} className="text-blue-700" />}
            title="Description"
          >
            <p>{diseaseInfo?.disease.description}</p>
          </InfoCard>
          {diseaseInfo?.disease.commonSymptoms?.length && (
            <InfoCard
              icon={<Stethoscope size={20} className="text-teal-600" />}
              title="Common Symptoms"
            >
              <ul className="list-disc list-inside grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                {diseaseInfo.disease.commonSymptoms.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </InfoCard>
          )}
          {diseaseInfo?.medications.overTheCounter?.length && (
            <InfoCard
              icon={<Pill size={20} className="text-indigo-600" />}
              title="Over-the-Counter Options"
            >
              {diseaseInfo.medications.overTheCounter.map((med) => (
                <div
                  key={med.name}
                  className="p-3 bg-gray-50 rounded-lg border"
                >
                  <p className="font-semibold text-gray-800">{med.name}</p>
                  <p className="text-xs text-gray-500">{med.purpose}</p>
                </div>
              ))}
            </InfoCard>
          )}
        </div>
        <div className="space-y-6">
          <InfoCard
            icon={<CheckCircle size={20} className="text-green-600" />}
            title="Immediate Steps"
          >
            <ul className="list-disc list-inside space-y-1">
              {diseaseInfo?.recommendations.immediateSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </InfoCard>
          <InfoCard
            icon={<Clock size={20} className="text-red-600" />}
            title="When to See a Doctor"
          >
            <p>{diseaseInfo?.recommendations.whenToSeeDoctor}</p>
            {diseaseInfo?.followUp.redFlags?.length && (
              <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-400 text-red-800 text-xs">
                <p className="font-semibold mb-1">
                  Seek immediate attention for:
                </p>
                <ul className="list-disc list-inside">
                  {diseaseInfo.followUp.redFlags.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </InfoCard>
          {recommendedDoctors.length > 0 && (
            <button
              onClick={() => setShowDoctors(!showDoctors)}
              className="w-full h-12 rounded-lg bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-blue-800"
            >
              <Users size={18} /> {showDoctors ? "Hide" : "Find"} Specialists (
              {recommendedDoctors.length})
            </button>
          )}
        </div>
      </div>
      {showDoctors && recommendedDoctors.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recommended Specialists Near You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-start"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center font-bold text-blue-700 text-2xl">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    doctor.name.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">Dr. {doctor.name}</h4>
                  <p className="text-sm font-medium text-blue-700">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {doctor.hospital.name}
                  </p>
                  <div className="text-xs text-gray-500 mt-2 flex items-center flex-wrap gap-x-3 gap-y-1">
                    <span>⭐ {doctor.rating}</span>
                    <span>{doctor.experience} Exp.</span>
                    <span className="font-semibold text-green-600">
                      {doctor.distance}
                    </span>
                  </div>
                </div>
                <button className="ml-auto self-start bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      {error && (
        <div className="max-w-3xl mx-auto mb-6 bg-red-50 p-4 rounded-lg border border-red-200 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm font-medium text-red-800">{error}</p>
        </div>
      )}

      {loadingDiseaseInfo ? (
        <div className="text-center p-10 flex flex-col items-center justify-center gap-4 text-gray-500">
          <Brain className="h-10 w-10 text-blue-700 animate-pulse" />
          <p>Loading details for {selectedDisease}...</p>
        </div>
      ) : selectedDisease && diseaseInfo ? (
        renderDiseaseDetails()
      ) : result ? (
        renderAnalysisResults()
      ) : (
        renderSymptomInput()
      )}
    </div>
  );
};

export default SymptomChecker;
