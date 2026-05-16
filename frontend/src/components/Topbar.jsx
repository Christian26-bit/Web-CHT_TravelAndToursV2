import { useAuth } from "../context/AuthContextInstance";

export default function Topbar() {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "AD";

  return (
    <header className="cv-topbar border-none shadow-[0_1px_40px_rgba(0,0,0,0.01)]">
      {/* Search area */}
      <div className="flex-1 flex items-center">
        <div className="relative w-full max-w-[600px] group">
          <svg
            className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#007BFF] transition-colors"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search bookings, tours, customers..."
            className="w-full h-14 pl-16 pr-6 rounded-2xl border border-slate-100 bg-slate-50/50 text-[14px] font-medium text-slate-900 outline-none focus:bg-white focus:border-[#007BFF] focus:shadow-[0_0_0_4px_rgba(0,123,255,0.05)] transition-all"
          />
        </div>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-8">
        {/* Notifications */}
        <button className="relative w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 hover:text-[#007BFF] hover:bg-slate-50 transition-all cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-14 h-14 rounded-2xl bg-[#007BFF] text-white flex items-center justify-center text-[16px] font-black shadow-xl shadow-[#007BFF]/20 group-hover:scale-105 active:scale-95 transition-all">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
