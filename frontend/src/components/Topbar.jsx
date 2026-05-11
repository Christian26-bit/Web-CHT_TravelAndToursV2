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
    <header className="sticky top-0 z-40 flex items-center justify-between px-10 py-5 bg-white/80 backdrop-blur-xl border-b border-slate-100/50 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {/* Search Box */}
      <div className="relative flex-1 max-w-[440px]">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 fill-slate-400 group-focus-within:fill-blue-600 transition-colors"
          viewBox="0 0 24 24"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
        <input
          type="text"
          placeholder="Search everything..."
          className="w-full py-3.5 pl-14 pr-6 bg-slate-50/50 border border-transparent rounded-2xl text-[14px] font-medium text-slate-900 outline-none transition-all focus:border-blue-200 focus:bg-white focus:shadow-lg focus:shadow-blue-600/5 placeholder:text-slate-400"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <button className="relative p-3 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all cursor-pointer group flex-shrink-0 border border-transparent hover:border-slate-100">
          <svg
            className="w-5 h-5 fill-slate-500 group-hover:fill-blue-600 transition-colors"
            viewBox="0 0 24 24"
          >
            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
          </svg>
          <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-black text-slate-900 leading-none">
              {user?.name || "Administrator"}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
              Active Session
            </p>
          </div>
          <div className="w-[44px] h-[44px] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white flex items-center justify-center text-[14px] font-black cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
