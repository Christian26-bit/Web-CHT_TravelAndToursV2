import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Check, Search, MapPin } from "lucide-react";

// --- VerticalStepper Component ---
function StepNode({ status }) {
  if (status === "completed") {
    return (
      <div className="size-9 rounded-full bg-[#007BFF] flex items-center justify-center text-white shrink-0 shadow-sm">
        <Check className="size-4" strokeWidth={3} />
      </div>
    );
  }
  if (status === "active" || status === "CURRENT") {
    return (
      <div className="relative shrink-0 size-9 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-[#007BFF]/20 animate-ping" />
        <span className="absolute inset-1 rounded-full bg-[#007BFF]/10" />
        <div className="relative size-9 rounded-full border-2 border-[#007BFF] bg-white flex items-center justify-center shadow-[0_0_0_4px_rgba(0,123,255,0.12)]">
          <div className="size-2.5 rounded-full bg-[#007BFF]" />
        </div>
      </div>
    );
  }
  return (
    <div className="size-9 rounded-full border-2 border-dashed border-slate-300 bg-white flex items-center justify-center shrink-0">
      <div className="size-2 rounded-full bg-slate-200" />
    </div>
  );
}

function VerticalStepper({ steps }) {
  if (!steps || steps.length === 0) {
    return <div className="text-slate-400 py-10 text-center text-sm">No flight tracking data available.</div>;
  }
  return (
    <ol className="flex flex-col">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        const status = step.Status === "CURRENT" ? "active" : step.Status === "COMPLETED" ? "completed" : "pending";
        const dim = status === "pending";
        return (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <StepNode status={status} />
              {!isLast && (
                <div
                  className={`w-px flex-1 min-h-[2.5rem] my-1 ${
                    status === "completed"
                      ? "bg-[#007BFF]"
                      : status === "active"
                      ? "bg-gradient-to-b from-[#007BFF] to-slate-200"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
            <div className={`pb-7 flex-1 -mt-0.5 ${dim ? "opacity-60" : ""}`}>
              <div className="flex items-baseline justify-between gap-2">
                <div className="font-bold text-slate-900">{step.Title}</div>
                {step.Timestamp && (
                  <div className="text-slate-500 text-sm tabular-nums">
                    {new Date(step.Timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    {step.Title !== 'Booking Confirmed' && step.Title !== 'Online check-in' && (
                      <span className="ml-1">
                        · {new Date(step.Timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {step.Description && (
                <div className="text-slate-500 mt-1.5 text-sm leading-relaxed">
                  {step.Description}
                </div>
              )}
              {status === "active" && (
                <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                  <span className="size-1.5 rounded-full bg-[#007BFF] animate-pulse" />
                  Currently here
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

// --- StatusBadge Component ---
function StatusBadge({ status, variant }) {
  const isDot = variant === "dot";
  switch (status) {
    case "IN AIR":
      return isDot ? (
        <div className="size-2 rounded-full bg-[#007BFF]" title="In Air" />
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <span className="size-1.5 rounded-full bg-[#007BFF] animate-pulse" />
          In Air
        </div>
      );
    case "ON TIME":
      return isDot ? (
        <div className="size-2 rounded-full bg-emerald-500" title="On Time" />
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
          <div className="size-1.5 rounded-full bg-emerald-500" />
          On Time
        </div>
      );
    case "DELAYED":
      return isDot ? (
        <div className="size-2 rounded-full bg-red-500" title="Delayed" />
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
          <div className="size-1.5 rounded-full bg-red-500 animate-pulse" />
          Delayed
        </div>
      );
    default:
      return isDot ? (
        <div className="size-2 rounded-full bg-slate-300" title="Pending" />
      ) : (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
          <div className="size-1.5 rounded-full bg-slate-400" />
          Pending
        </div>
      );
  }
}

// --- Main Page Component ---
export default function UserTrips() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const formatName = (fullName) => {
    if (!fullName) return "—";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, m, l] = parts;
      return `${f} ${l}`;
    }
    return fullName;
  };

  const getInitials = (name) => {
    const formatted = formatName(name);
    return formatted.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "C";
  };

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const res = await api.get("/journeys");
        if (res.data.success) {
          setBookings(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedBooking(res.data.data[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch journeys:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJourneys();
  }, []);

  const filtered = bookings.filter((b) =>
    formatName(b.Client?.Name).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="cv-main-container animate-fade-in pb-20">
      <div className="space-y-6">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Client Journeys</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Track each client from booking to arrival.</p>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-3">
            <div className="relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clients…"
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-slate-200 outline-none focus:border-[#007BFF] transition-colors text-sm"
              />
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto no-scrollbar">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-slate-100 animate-pulse" />)
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center bg-white border border-slate-200 rounded-xl border-dashed">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No clients found</span>
                </div>
              ) : (
                filtered.map((c) => {
                  const isActive = selectedBooking?.BookingID === c.BookingID;
                  const flightStatus = c.ClientJourneys?.[0]?.Flight?.status || "PENDING";
                  
                  return (
                    <button
                      key={c.BookingID}
                      onClick={() => setSelectedBooking(c)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                        isActive
                          ? "bg-white border border-[#007BFF] ring-2 ring-[#007BFF]/10 shadow-sm"
                          : "bg-white border border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="size-10 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0 font-black text-sm">
                        {getInitials(c.Client?.Name)}
                      </div>
                      <div className="flex-1 min-w-0 leading-tight">
                        <div className="truncate font-bold text-slate-900 text-sm mb-0.5">{formatName(c.Client?.Name)}</div>
                        <div className="text-slate-500 text-xs truncate font-medium">{c.Package?.Name || "Custom Trip"}</div>
                      </div>
                      <StatusBadge status={flightStatus} variant="dot" />
                    </button>
                  );
                })
              )}
            </div>
          </aside>

          <section className="rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-sm min-h-[500px]">
            {selectedBooking ? (
              <>
                <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center font-black text-lg">
                      {getInitials(selectedBooking.Client?.Name)}
                    </div>
                    <div className="leading-tight">
                      <div className="font-bold text-slate-900 text-lg mb-0.5">{formatName(selectedBooking.Client?.Name)}</div>
                      <div className="text-slate-500 text-sm font-medium">{selectedBooking.Package?.Name || "Custom Trip"}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-1.5 font-medium">
                        <MapPin className="size-3.5" />
                        {selectedBooking.Client?.Address || selectedBooking.Package?.Destination || "Location Unknown"}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={selectedBooking.ClientJourneys?.[0]?.Flight?.status || "PENDING"} />
                </div>

                <VerticalStepper steps={selectedBooking.ClientJourneys} />
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-50 py-20">
                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <MapPin className="size-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Select a Client</h3>
                <p className="text-sm font-medium text-slate-500">Track each client from booking to arrival.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
