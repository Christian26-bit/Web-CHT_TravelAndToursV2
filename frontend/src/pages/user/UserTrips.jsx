import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Check,
  MapPin,
  Search,
  Plane,
  Clock3,
  Hotel,
  LocateFixed,
} from "lucide-react";

function TimelineIcon({ status, icon }) {
  if (status === "completed") {
    return (
      <div className="size-10 rounded-full bg-blue-600 text-white flex items-center justify-center z-10 border-4 border-white">
        {icon}
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="relative z-10">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        <div className="size-10 rounded-full bg-white border-[3px] border-blue-600 text-blue-600 flex items-center justify-center shadow-sm relative">
          {icon}
        </div>
      </div>
    );
  }

  return (
    <div className="size-10 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center z-10">
      {icon}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    "IN AIR": "bg-blue-50 text-blue-700 border-blue-100",
    "ON TIME": "bg-emerald-50 text-emerald-700 border-emerald-100",
    DELAYED: "bg-red-50 text-red-700 border-red-100",
    PENDING: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <div
      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
        map[status] || map.PENDING
      }`}
    >
      {status || "Pending"}
    </div>
  );
}

function TimelineCard({ step, isLast }) {
  const status =
    step.Status === "CURRENT"
      ? "active"
      : step.Status === "COMPLETED"
        ? "completed"
        : "pending";

  const iconMap = {
    "Booking Confirmed": <Check className="size-4" />,
    Boarding: <Plane className="size-4" />,
    "In Flight": <Plane className="size-4" />,
    "Hotel Check-in": <Hotel className="size-4" />,
  };

  return (
    <div className="flex gap-5 relative">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <TimelineIcon
          status={status}
          icon={iconMap[step.Title] || <LocateFixed className="size-4" />}
        />

        {!isLast && (
          <div
            className={`w-[2px] flex-1 min-h-[90px] ${
              status === "completed" || status === "active"
                ? "bg-blue-600"
                : "bg-slate-200"
            }`}
          />
        )}
      </div>

      {/* Card */}
      <div
        className={`flex-1 rounded-xl border bg-white overflow-hidden ${
          status === "active" ? "border-blue-500" : "border-slate-200"
        }`}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[16px] font-semibold text-slate-900">
                {step.Title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {step.Description || "Journey update"}
              </p>
            </div>

            {step.Timestamp && (
              <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {new Date(step.Timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Status
              </span>

              <div className="mt-2">
                <StatusPill
                  status={
                    status === "active"
                      ? "IN AIR"
                      : status === "completed"
                        ? "ON TIME"
                        : "PENDING"
                  }
                />
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Location
              </span>

              <p className="mt-2 text-sm font-medium text-slate-700">
                Tokyo, Japan
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Time
              </span>

              <p className="mt-2 text-sm font-medium text-slate-700">
                08:45 AM
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                Details
              </span>

              <p className="mt-2 text-sm font-medium text-slate-700">
                Flight PR-4821
              </p>
            </div>
          </div>

          {status === "active" && (
            <div className="mt-5 flex items-center gap-2 text-sm text-blue-700 font-semibold">
              <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
              Currently active
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UserTrips() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const formatName = (fullName) => {
    if (!fullName) return "Unknown";

    const parts = fullName.split("|");

    if (parts.length === 3) {
      return `${parts[0]} ${parts[2]}`;
    }

    return fullName;
  };

  const initials = (name) => {
    return formatName(name)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  const filtered = bookings.filter((b) =>
    formatName(b.Client?.Name).toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      {/* Sidebar */}
      <aside className="w-[280px] bg-white border-r border-slate-200 p-5">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900">
            Active Clients
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Track journey milestones
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="size-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Client list */}
        <div className="space-y-2">
          {loading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl bg-slate-100 animate-pulse"
                />
              ))
            : filtered.map((client) => {
                const active = selectedBooking?.BookingID === client.BookingID;

                return (
                  <button
                    key={client.BookingID}
                    onClick={() => setSelectedBooking(client)}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${
                      active
                        ? "bg-blue-50 border-blue-500"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {initials(client.Client?.Name)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-slate-900 truncate">
                          {formatName(client.Client?.Name)}
                        </h3>

                        <p className="text-xs text-slate-500 truncate mt-1">
                          {client.Package?.Destination || "Tokyo, Japan"}
                        </p>
                      </div>

                      <div className="size-2 rounded-full bg-blue-500" />
                    </div>
                  </button>
                );
              })}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-y-auto">
        {selectedBooking ? (
          <>
            {/* Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">
                    {initials(selectedBooking.Client?.Name)}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      {formatName(selectedBooking.Client?.Name)}
                    </h2>

                    <div className="flex items-center gap-2 mt-2 text-slate-500 text-sm">
                      <MapPin className="size-4" />
                      {selectedBooking.Package?.Destination || "Tokyo, Japan"}
                    </div>
                  </div>
                </div>

                <StatusPill
                  status={
                    selectedBooking.ClientJourneys?.[0]?.Flight?.status ||
                    "ON TIME"
                  }
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                    Departure
                  </span>

                  <p className="mt-2 font-semibold text-slate-900">May 17</p>

                  <p className="text-sm text-slate-500">Manila (MNL)</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                    Arrival
                  </span>

                  <p className="mt-2 font-semibold text-slate-900">May 17</p>

                  <p className="text-sm text-slate-500">Tokyo (HND)</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                    Duration
                  </span>

                  <p className="mt-2 font-semibold text-slate-900">5 Nights</p>

                  <p className="text-sm text-slate-500">May 17 - May 22</p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <span className="text-[11px] uppercase text-slate-400 font-bold tracking-wider">
                    Return
                  </span>

                  <p className="mt-2 font-semibold text-slate-900">May 22</p>

                  <p className="text-sm text-slate-500">Tokyo → Manila</p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              {selectedBooking.ClientJourneys?.map((step, index) => (
                <TimelineCard
                  key={index}
                  step={step}
                  isLast={index === selectedBooking.ClientJourneys.length - 1}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Clock3 className="size-12 text-slate-300 mx-auto mb-4" />

              <h3 className="text-lg font-semibold text-slate-900">
                No Client Selected
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Select a client to view their journey timeline.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
