import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { type RootState } from "../store/store";
import { Stethoscope, ArrowRight } from "lucide-react";
import { healthLogsAPI } from "../services/api";

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const [logs, setLogs] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Hardcoded patient phone for now
  const TEST_PHONE = "+918088625479";

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await healthLogsAPI.getLogsByPhone(TEST_PHONE);
        setLogs(res.data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-8 p-2 md:p-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here's your latest health activity summary
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          
<section>
  <h2 className="text-xl font-semibold text-gray-700 mb-4">
    Your Recent Health Logs
  </h2>

  {loading ? (
    <div className="p-6 text-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-gray-500 mt-2">Loading logs…</p>
    </div>
  ) : logs ? (
    <div className="space-y-10">

      {/* Meal Logs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          🍽️ Meal Logs
        </h3>

        {logs.mealLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No meal logs found.</p>
        ) : (
          <div className="space-y-4">
            {logs.mealLogs.map((log: any) => (
              <div
                key={log._id}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm"
              >
                <p className="text-base font-semibold text-gray-800">
                  {log.date} — {log.time}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  <p><strong>Meal Type:</strong> {log.meal_type}</p>
                  <p><strong>Input:</strong> {log.input_type}</p>
                </div>

                {log.description && (
                  <p className="mt-2 text-gray-700 text-sm">
                    <strong>Description:</strong> {log.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 mt-3 gap-2 text-sm text-gray-700">
                  <p><strong>Calories:</strong> {log.total_calories}</p>
                  <p><strong>Carbs:</strong> {log.carbs_g}g</p>
                  <p><strong>Protein:</strong> {log.protein_g}g</p>
                  <p><strong>Fats:</strong> {log.fats_g}g</p>
                  <p><strong>Health Score:</strong> {log.health_score}</p>
                </div>

                {log.items?.length > 0 && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Items:</strong> {log.items.join(", ")}
                  </p>
                )}

                {log.analysis?.brief_assessment && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Assessment:</strong> {log.analysis.brief_assessment}
                  </p>
                )}

                {log.analysis?.top_suggestion && (
                  <p className="mt-1 text-sm text-gray-700">
                    <strong>Suggestion:</strong> {log.analysis.top_suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vital Logs */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          📊 Vital Logs
        </h3>

        {logs.vitalLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">No vital logs found.</p>
        ) : (
          <div className="space-y-4">
            {logs.vitalLogs.map((log: any) => (
              <div
                key={log._id}
                className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm"
              >
                <p className="text-base font-semibold text-gray-800">
                  {log.date} — {log.time}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  <p><strong>Type:</strong> {log.type}</p>
                  <p><strong>Input:</strong> {log.input_type}</p>
                </div>

                {log.description && (
                  <p className="mt-2 text-gray-700 text-sm">
                    <strong>Description:</strong> {log.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 mt-3 gap-2 text-sm text-gray-700">
                  <p><strong>Calories:</strong> {log.calories_consumed}</p>
                  <p><strong>Carbs:</strong> {log.carbs_g}g</p>
                  <p><strong>Protein:</strong> {log.protein_g}g</p>
                  <p><strong>Fats:</strong> {log.fats_g}g</p>
                  <p><strong>Health Score:</strong> {log.health_score}</p>
                </div>

                {log.items?.length > 0 && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Items:</strong> {log.items.join(", ")}
                  </p>
                )}

                {log.analysis?.brief_assessment && (
                  <p className="mt-3 text-sm text-gray-700">
                    <strong>Assessment:</strong> {log.analysis.brief_assessment}
                  </p>
                )}

                {log.analysis?.top_suggestion && (
                  <p className="mt-1 text-sm text-gray-700">
                    <strong>Suggestion:</strong> {log.analysis.top_suggestion}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  ) : (
    <p className="text-gray-500">No logs found.</p>
  )}
</section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
