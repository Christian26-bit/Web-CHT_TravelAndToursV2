import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextInstance";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setMessage({
        type: "error",
        text: "Please enter your email and password.",
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "loading", text: "Authenticating..." });

    try {
      const res = await api.post("/login", { email: email.trim(), password });

      if (res.data.success) {
        login(res.data.token, {
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
        });

        setMessage({
          type: "success",
          text: "Login successful! Redirecting...",
        });

        setTimeout(() => {
          if (res.data.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, 500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Wrong email or password.";
      setMessage({ type: "error", text: errorMsg });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] py-12 px-6">
      <div className="w-full max-w-[480px] bg-white rounded-[48px] pt-16 pb-16 px-14 shadow-[0_40px_100px_rgba(0,0,0,0.06)] animate-fade-in flex flex-col items-center border border-slate-100">
        {/* Brand Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/30 mb-10 rotate-3">
          <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24">
            <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-[34px] font-[900] text-slate-900 tracking-tighter uppercase leading-none">
            Welcome Back
          </h2>
          <p className="text-[16px] text-slate-400 font-bold mt-3 tracking-tight">
            Sign in to manage your travels
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="w-full space-y-7"
        >
          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
              Account Identifier
            </label>
            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Username"
                className="w-full h-[64px] pl-14 pr-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_30px_rgba(37,99,235,0.08)] placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[2px] ml-1">
              Secure Password
            </label>
            <div className="relative">
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-[64px] pl-14 pr-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-[15px] font-bold text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:shadow-[0_10px_30px_rgba(37,99,235,0.08)] placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Message Area */}
          {message.text && (
            <div
              className={`p-5 rounded-2xl text-center text-[13px] font-black border transition-all animate-fade-in ${
                message.type === "error"
                  ? "bg-red-50 text-red-600 border-red-100"
                  : message.type === "success"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[68px] bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[16px] font-[900] uppercase tracking-widest shadow-2xl shadow-blue-600/25 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer active:scale-[0.98] hover:-translate-y-1"
            >
              {loading ? "Authenticating..." : "Sign In Now"}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[3px]">
            CHT Travel & Tour Management
          </p>
          <div className="w-10 h-0.5 bg-slate-100 mx-auto mt-4 mb-4"></div>
          <p className="text-[11px] text-slate-300 font-bold">
            &copy; 2026 Cloud-Based Travel System
          </p>
        </div>
      </div>
    </div>
  );
}
