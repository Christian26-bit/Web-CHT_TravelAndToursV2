import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContextInstance";
import api from "../api/axios";
import chtLogo from "../assets/cht-logo.png";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      setMessage({ type: "error", text: "Please enter your email and password." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", { email: email.trim(), password });
      if (res.data.success) {
        login(res.data.token, { name: res.data.name, email: res.data.email, role: res.data.role });
        setMessage({ type: "success", text: "Login successful. Redirecting..." });
        setTimeout(() => {
          if (res.data.role === "admin") navigate("/admin/dashboard");
          else navigate("/user/dashboard");
        }, 800);
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Invalid credentials. Please try again." });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] font-inter relative overflow-hidden">
      {/* Premium background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[80px]" />

      <Card className="w-full max-w-[460px] shadow-[0_40px_100px_rgba(0,123,255,0.06)] border border-slate-50 relative z-10 mx-6 animate-fade-in">
        <CardHeader className="flex flex-col items-center text-center pt-12 pb-8">
          <div className="w-28 h-16 mb-6 flex items-center justify-center">
            <img src={chtLogo} alt="CHT Travel" className="w-full h-full object-contain" />
          </div>
          <CardTitle className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-2">Login</CardTitle>
          <CardDescription className="text-[14px] font-medium text-slate-500">Welcome back, please login to your account.</CardDescription>
        </CardHeader>

        <CardContent className="px-12 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-14 px-6 bg-slate-50 border-slate-100 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-14 px-6 bg-slate-50 border-slate-100 text-[14px] font-bold text-slate-900 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary transition-all placeholder:text-slate-300"
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-xl text-[12px] font-bold text-center animate-fade-in ${
                message.type === "error" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              }`}>
                {message.text}
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-16 text-[13px] font-black uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                {loading ? "Loading..." : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="justify-center pb-12 pt-4">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">CHT Travel & Tours</p>
        </CardFooter>
      </Card>
    </div>
  );
}
