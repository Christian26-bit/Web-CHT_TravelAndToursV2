import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Check, Search, MapPin } from "lucide-react";

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

export default function UserTrips() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedFlightId, setSelectedFlightId] = useState(101);

  const mockFlights = [
    {
      id: 101,
      airline: "Skyline Airways",
      code: "SK 482",
      class: "Economy",
      logo: "SA",
      logoBg: "bg-[#115e59]",
      departTime: "08:45",
      departPort: "JFK",
      departCity: "New York",
      arriveTime: "21:10",
      arrivePort: "LHR",
      arriveCity: "London",
      duration: "7h 25m",
      stops: "Non-stop",
      status: "On time",
      refundable: true,
      priceUSD: 642,
      originalPriceUSD: 709
    },
    {
      id: 102,
      airline: "Cirrus Pacific",
      code: "CP 1190",
      class: "Premium Economy",
      logo: "CP",
      logoBg: "bg-[#f97316]",
      departTime: "14:20",
      departPort: "JFK",
      departCity: "New York",
      arriveTime: "06:55",
      arrivePort: "LHR",
      arriveCity: "London",
      duration: "11h 35m",
      stops: "1 stop · 2h KEF",
      status: "On time",
      refundable: false,
      priceUSD: 548,
      originalPriceUSD: null
    }
  ];

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
    <div className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in select-none w-full">
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Client Journeys
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Trip Tracking
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Track flight timelines, journey milestones, and client logistics in real time.
          </p>
        </div>
      </header>

      <div className="space-y-6 w-full">
        <div className="grid lg:grid-cols-[320px_1fr] gap-6 w-full">
          <aside className="space-y-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-[16px] w-[16px] text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search clients…"
                className="w-full h-10 pl-9 pr-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1.5 max-h-[700px] overflow-y-auto no-scrollbar">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-16 bg-white rounded-[12px] border border-[#e2e8f0] animate-pulse" />)
              ) : filtered.length === 0 ? (
                <div className="p-8 text-center bg-white border border-solid border-[#e2e8f0] rounded-[12px]">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">No clients found</span>
                </div>
              ) : (
                filtered.map((c) => {
                  const isActive = selectedBooking?.BookingID === c.BookingID;
                  const flightStatus = c.ClientJourneys?.[0]?.Flight?.status || "PENDING";
                  
                  return (
                    <button
                      key={c.BookingID}
                      onClick={() => setSelectedBooking(c)}
                      className={`w-full flex items-center gap-3 p-3 rounded-[8px] text-left transition-colors border border-solid ${
                        isActive
                          ? "bg-white border-[#007BFF] ring-1 ring-[#007BFF] shadow-sm"
                          : "bg-white border-[#e2e8f0] hover:border-slate-300"
                      }`}
                    >
                      <div className="size-10 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center shrink-0 font-bold text-sm">
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

          <section className="rounded-[12px] bg-white border border-solid border-[#e2e8f0] p-6 md:p-8 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] min-h-[500px]">
            {selectedBooking ? (
              <>
                <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-[#f1f5f9]">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-full bg-blue-50 text-[#007BFF] flex items-center justify-center font-bold text-lg">
                      {getInitials(selectedBooking.Client?.Name)}
                    </div>
                    <div className="leading-tight">
                      <div className="font-bold text-slate-900 text-lg mb-0.5">{formatName(selectedBooking.Client?.Name)}</div>
                      <div className="text-slate-500 text-sm font-medium">{selectedBooking.Package?.Name || "Custom Trip"}</div>
                      <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-1.5 font-medium">
                        <MapPin className="size-3.5 text-[#007bff]" />
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

        <div className="w-full h-[1px] bg-[#f1f5f9] my-6" />

        <div className="flex flex-col gap-[20px] w-full">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-[4px]">
              <h2 className="font-['Arimo-Regular',sans-serif] font-medium text-[20px] text-[#1e293b] tracking-tight leading-none">
                Available Flight Itineraries
              </h2>
              <p className="font-['Arimo-Regular',sans-serif] text-[13px] text-[#64748b]">
                3 itineraries for your client <span className="font-bold text-[#1e293b]">{selectedBooking ? formatName(selectedBooking.Client?.Name) : "Amelia Brooks"}</span> &middot; JFK &rarr; LHR
              </p>
            </div>
            <div className="flex items-center gap-[8px]">
              <button className="h-9 px-3 rounded-[6px] border border-[#cbd5e1] bg-white text-[12px] font-medium text-[#1e293b] hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5 2.245 5 5v1h1a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3v-6a3 3 0 013-3h1V8c0-2.755 2.245-5 5-5z" /></svg>
                <span>Filters</span>
              </button>
              <button className="h-9 px-3 rounded-[6px] border border-[#cbd5e1] bg-white text-[12px] font-medium text-[#1e293b] hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                <svg className="w-3.5 h-3.5 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 8h18M3 12h18M3 16h18" /></svg>
                <span>Sort</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col lg:flex-row items-center gap-4 w-full">
            <div className="flex-1 flex items-center gap-3 px-3 py-1 border-r border-[#f1f5f9] w-full">
              <div className="w-9 h-9 rounded-[6px] bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">From</span>
                <span className="text-[13px] font-bold text-slate-800 leading-none">New York (JFK)</span>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 py-1 border-r border-[#f1f5f9] w-full">
              <div className="w-9 h-9 rounded-[6px] bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">To</span>
                <span className="text-[13px] font-bold text-slate-800 leading-none">London (LHR)</span>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 py-1 border-r border-[#f1f5f9] w-full">
              <div className="w-9 h-9 rounded-[6px] bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Depart</span>
                <span className="text-[13px] font-bold text-slate-800 leading-none">Wed, May 13</span>
              </div>
            </div>

            <div className="flex-1 flex items-center gap-3 px-3 py-1 w-full">
              <div className="w-9 h-9 rounded-[6px] bg-slate-50 flex items-center justify-center text-slate-400">
                <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 018.625 21c-2.238 0-4.307-.643-6.053-1.758a4.125 4.125 0 017.533-2.493M14.25 9.625a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM16.5 6a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Travelers</span>
                <span className="text-[13px] font-bold text-slate-800 leading-none">1 adult - Economy</span>
              </div>
            </div>

            <button className="w-full lg:w-fit min-h-[40px] px-5 rounded-[6px] bg-[#007bff] hover:bg-[#0069d9] text-white font-bold text-[12px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
              <span>Search</span>
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Active bookings</span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-[20px] font-bold text-slate-800 tracking-tight">128</span>
                <span className="text-[11px] font-bold text-[#00c950]">+12%</span>
              </div>
            </div>
            <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Travelers in air</span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-[20px] font-bold text-slate-800 tracking-tight">34</span>
                <span className="text-[11px] font-bold text-[#007BFF]">Live</span>
              </div>
            </div>
            <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">Avg. ticket</span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-[20px] font-bold text-slate-800 tracking-tight">$684</span>
                <span className="text-[11px] font-bold text-red-500">-3.2%</span>
              </div>
            </div>
            <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] flex flex-col">
              <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider">On-time rate</span>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-[20px] font-bold text-slate-800 tracking-tight">94%</span>
                <span className="text-[11px] font-bold text-[#00c950]">+1.8%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <h3 className="font-['Arimo-Regular',sans-serif] font-medium text-[16px] text-[#1e293b]">
              Available Flights
            </h3>
            <span className="text-[11px] font-medium text-slate-400">Prices include taxes & fees</span>
          </div>

          <div className="flex flex-col gap-4 w-full">
            {mockFlights.map((flight) => {
              const isSelected = selectedFlightId === flight.id;
              return (
                <div
                  key={flight.id}
                  onClick={() => setSelectedFlightId(flight.id)}
                  className={`transition-all duration-300 border border-solid rounded-[12px] bg-white cursor-pointer overflow-hidden flex flex-col lg:flex-row items-stretch justify-between p-5 gap-5 relative group ${
                    isSelected
                      ? "border-[#007BFF] shadow-[0px_4px_12px_rgba(0,123,255,0.05)]"
                      : "border-[#e2e8f0] hover:border-slate-300 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]"
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-[240px]">
                    <div className={`w-12 h-12 rounded-[8px] ${flight.logoBg} text-white flex items-center justify-center text-[16px] font-black shrink-0 transition-transform group-hover:scale-105`}>
                      {flight.logo}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="text-[15px] font-bold text-slate-800 leading-tight">{flight.airline}</h4>
                      <span className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-wider">{flight.code} &middot; {flight.class}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 justify-center flex-2 border-y lg:border-y-0 lg:border-x border-slate-50 px-5 py-3 lg:py-0 min-w-[280px]">
                    <div className="text-left shrink-0">
                      <p className="text-[18px] font-bold text-slate-800 leading-none">{flight.departTime}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{flight.departPort} - {flight.departCity}</p>
                    </div>
                    
                    <div className="flex flex-col items-center flex-1 gap-1 relative px-1">
                      <span className="text-[9px] font-bold text-slate-400">{flight.duration}</span>
                      <div className="relative w-full h-[2px] bg-slate-200 flex items-center justify-between">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-[#007bff] transition-colors">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#007bff]" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{flight.stops}</span>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-[18px] font-bold text-slate-800 leading-none">{flight.arriveTime}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{flight.arrivePort} - {flight.arriveCity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 justify-between lg:justify-end flex-1 min-w-[240px]">
                    <div className="flex flex-col gap-2 justify-center">
                      <div className="flex items-center gap-1.5">
                        {flight.status && <span className="px-2 py-0.5 rounded-[4px] bg-[#00c950]/10 text-[#00a63e] text-[9px] font-bold uppercase tracking-wider">{flight.status}</span>}
                        {flight.refundable && <span className="px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-500 text-[9px] font-bold uppercase tracking-wider">Refundable</span>}
                      </div>
                      {/* Inline icons */}
                      <div className="flex items-center gap-2 text-slate-300">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.14 0" /></svg>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      </div>
                    </div>

                    {/* Pricing and Button */}
                    <div className="flex items-center gap-3 shrink-0 text-right">
                      <div>
                        {flight.originalPriceUSD && (
                          <p className="text-[11px] text-slate-300 line-through leading-none mb-0.5">₱{flight.originalPriceUSD}</p>
                        )}
                        <p className="text-[20px] font-bold text-slate-800 leading-none">₱{flight.priceUSD}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">per traveler</p>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFlightId(flight.id);
                        }}
                        className={`min-h-[36px] px-4 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center ${
                          isSelected
                            ? "bg-[#007BFF] text-white shadow-sm"
                            : "bg-slate-50 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        {isSelected ? "Selected" : "Select"}
                      </button>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,123,255,0.01)] to-transparent pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
