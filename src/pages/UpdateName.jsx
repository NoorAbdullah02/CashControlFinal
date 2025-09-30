import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, LoaderCircle } from "lucide-react";
import Input from "../components/Input.jsx";
import Header from "../components/Header.jsx";
import axiosConfig from "../util/axiosConfig.jsx";
import { API_ENDPOINTS } from "../util/apiEndpoints.js";
import toast from "react-hot-toast";
import Dashboard from "../components/Dashboard.jsx";


const UpdateName = () => {
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosConfig.put(API_ENDPOINTS.UPDATE_NAME, {
        fullName,
      });
      if (response.status === 200) {
        toast.success("Name updated successfully!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Error updating name", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <div className="flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60">
            <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Update Your Name
            </h2>
            <form onSubmit={handleUpdate} className="space-y-6">
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                label="Enter Your New Name"
                placeholder="Sheikh Noor Abdullah"
                type="text"
              />

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              <button
                disabled={isLoading}
                className={`w-full py-3 px-6 text-white font-semibold rounded-xl transition-all duration-300 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:scale-105 hover:shadow-lg"
                }`}
                type="submit"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <LoaderCircle className="animate-spin w-5 h-5" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>Update Name</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateName;
