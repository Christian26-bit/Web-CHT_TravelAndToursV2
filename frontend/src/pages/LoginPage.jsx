import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextInstance";
import { Mail, Lock } from "lucide-react";
import api from "../api/axios";
import chtLogo from "../assets/cht-logo.png";

export default function LoginPage() {
  const emailId = useId();
  const passwordId = useId();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setMessage({
        type: "error",
        text: "Please enter your email and password.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", {
        email: formData.email.trim(),
        password: formData.password,
      });
      if (res.data.success) {
        login(res.data.token, {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });
        setMessage({
          type: "success",
          text: "Login successful. Redirecting...",
        });
        setTimeout(() => {
          if (res.data.role === "admin") navigate("/admin/dashboard");
          else navigate("/user/dashboard");
        }, 800);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err.response?.data?.error || "Invalid credentials. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F0F1F1] w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6">
      <section
        className="w-full max-w-[491px] flex flex-col gap-8 relative z-10"
        aria-labelledby="login-title"
      >
        <div className="flex w-full relative flex-col items-center p-[33px] bg-white rounded-[32px] border border-solid border-slate-100/50 shadow-[0_20px_50px_rgba(0,0,0,0.06)]">
          {/* Logo Section */}
          <div className="flex flex-col w-full items-center mb-8">
            <div className="relative w-full h-[120px] flex justify-center items-center">
              <img
                className="w-[285px] h-[120px] object-contain"
                alt="CHT Travel and Tours"
                src={chtLogo}
              />
            </div>
          </div>

          <form className="w-full flex flex-col gap-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col w-full items-start gap-1">
              <label
                className="font-bold text-[13px] text-slate-800 tracking-wide uppercase"
                htmlFor={emailId}
              >
                Email Address
              </label>
              <div className="cv-input-group">
                <Mail className="cv-input-icon" />
                <input
                  className="cv-input"
                  id={emailId}
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  autoComplete="email"
                  aria-label="Email Address"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col w-full items-start gap-1">
              <label
                className="font-bold text-[13px] text-slate-800 tracking-wide uppercase"
                htmlFor={passwordId}
              >
                Password
              </label>
              <div className="cv-input-group">
                <Lock className="cv-input-icon" />
                <input
                  className="cv-input"
                  id={passwordId}
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  autoComplete="current-password"
                  aria-label="Password"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((previous) => ({
                      ...previous,
                      password: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Feedback Message */}
            {message.text && (
              <div
                className={`p-4 rounded-2xl text-[13px] font-semibold text-center border ${
                  message.type === "error"
                    ? "bg-red-50/80 text-red-600 border-red-100"
                    : "bg-emerald-50/80 text-emerald-600 border-emerald-100"
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end w-full">
              <button
                type="button"
                className="text-[13px] font-bold text-[#007BFF] hover:text-[#0059BC] transition-colors cursor-pointer hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              className="cv-btn-primary w-full cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  LOGGING IN...
                </span>
              ) : (
                "LOGIN"
              )}
            </button>
          </form>
        </div>

        {/* Footer Text */}
        <div className="flex w-full items-center justify-center">
          <p className="font-semibold text-slate-500 text-sm text-center tracking-wide">
            Travel with confidence, manage with ease
          </p>
        </div>
      </section>
    </main>
  );
}
