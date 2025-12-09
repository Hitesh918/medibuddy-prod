import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { vaultPinAPI } from "../services/api";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const VaultPinSetup: React.FC = () => {
  const [hasPinSet, setHasPinSet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pinInfo, setPinInfo] = useState<any>(null);

  // Setup states
  const [setupMode, setSetupMode] = useState<"create" | "update" | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [showOldPin, setShowOldPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const response = await vaultPinAPI.checkStatus();
      setHasPinSet(response.data.hasPinSet);
      setPinInfo(response.data);
    } catch (error: any) {
      console.error("Error checking PIN status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(pin)) {
      toast.error("PIN must be exactly 6 digits");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("PINs do not match");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Setting up your vault PIN...");

    try {
      await vaultPinAPI.setupPin(pin, confirmPin);
      toast.success("Vault PIN created successfully!", { id: loadingToast });
      setHasPinSet(true);
      setSetupMode(null);
      setPin("");
      setConfirmPin("");
      checkPinStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to set up PIN", {
        id: loadingToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(pin)) {
      toast.error("New PIN must be exactly 6 digits");
      return;
    }

    if (pin !== confirmPin) {
      toast.error("New PINs do not match");
      return;
    }

    if (!oldPin) {
      toast.error("Current PIN is required");
      return;
    }

    setSubmitting(true);
    const loadingToast = toast.loading("Updating your vault PIN...");

    try {
      await vaultPinAPI.updatePin(oldPin, pin, confirmPin);
      toast.success("Vault PIN updated successfully!", { id: loadingToast });
      setSetupMode(null);
      setPin("");
      setConfirmPin("");
      setOldPin("");
      checkPinStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to update PIN", {
        id: loadingToast,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemovePin = async () => {
    const pinToRemove = prompt(
      "Enter your current 6-digit PIN to disable vault access:"
    );

    if (!pinToRemove) return;

    if (!/^\d{6}$/.test(pinToRemove)) {
      toast.error("Invalid PIN format");
      return;
    }

    const loadingToast = toast.loading("Removing vault PIN...");

    try {
      await vaultPinAPI.removePin(pinToRemove);
      toast.success("Vault PIN removed successfully!", { id: loadingToast });
      setHasPinSet(false);
      checkPinStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to remove PIN", {
        id: loadingToast,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            What is Vault PIN?
          </h3>
          <p className="text-sm text-blue-700">
            Your Vault PIN is a secure 6-digit code that allows doctors to
            access your medical records. Share this PIN only with trusted
            healthcare providers during consultations.
          </p>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-lg ${
                hasPinSet ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <Shield
                className={`h-6 w-6 ${
                  hasPinSet ? "text-green-600" : "text-gray-400"
                }`}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Vault PIN Status
              </h2>
              <p className="text-sm text-gray-600">
                {hasPinSet ? "Your vault is protected" : "No PIN set up yet"}
              </p>
            </div>
          </div>
          {hasPinSet ? (
            <CheckCircle className="h-8 w-8 text-green-600" />
          ) : (
            <Lock className="h-8 w-8 text-gray-400" />
          )}
        </div>

        {hasPinSet && pinInfo && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Created:</strong>{" "}
              {pinInfo.pinCreatedAt
                ? new Date(pinInfo.pinCreatedAt).toLocaleDateString()
                : "N/A"}
            </p>
            {pinInfo.pinLastUpdated && (
              <p className="text-sm text-gray-600">
                <strong>Last Updated:</strong>{" "}
                {new Date(pinInfo.pinLastUpdated).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!setupMode && (
        <div className="flex gap-4">
          {!hasPinSet ? (
            <button
              onClick={() => setSetupMode("create")}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Lock size={20} />
              Create Vault PIN
            </button>
          ) : (
            <>
              <button
                onClick={() => setSetupMode("update")}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Update PIN
              </button>
              <button
                onClick={handleRemovePin}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Remove PIN
              </button>
            </>
          )}
        </div>
      )}

      {/* Setup/Update Forms */}
      {setupMode === "create" && (
        <form
          onSubmit={handleSetupPin}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Create Your Vault PIN
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-Digit PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm PIN
            </label>
            <div className="relative">
              <input
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSetupMode(null);
                setPin("");
                setConfirmPin("");
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                submitting || pin.length !== 6 || confirmPin.length !== 6
              }
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Creating..." : "Create PIN"}
            </button>
          </div>
        </form>
      )}

      {setupMode === "update" && (
        <form
          onSubmit={handleUpdatePin}
          className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Update Your Vault PIN
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current PIN
            </label>
            <div className="relative">
              <input
                type={showOldPin ? "text" : "password"}
                value={oldPin}
                onChange={(e) =>
                  setOldPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPin(!showOldPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showOldPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New 6-Digit PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New PIN
            </label>
            <div className="relative">
              <input
                type={showConfirmPin ? "text" : "password"}
                value={confirmPin}
                onChange={(e) =>
                  setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="000000"
                maxLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPin(!showConfirmPin)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setSetupMode(null);
                setPin("");
                setConfirmPin("");
                setOldPin("");
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                submitting ||
                oldPin.length !== 6 ||
                pin.length !== 6 ||
                confirmPin.length !== 6
              }
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Updating..." : "Update PIN"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default VaultPinSetup;
