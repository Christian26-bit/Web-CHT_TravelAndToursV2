import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import api from "../../api/axios";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        if (res.data.success && isMounted) setBookings(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchBookings();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = bookings.filter(
    (b) => statusFilter === "all" || b.Status?.toLowerCase() === statusFilter,
  );
  const statusColors = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-1">
          <h2 className="text-lg font-bold text-slate-800">
            Bookings Management
          </h2>
          <p className="text-sm text-slate-500">
            View and manage all travel bookings.
          </p>
        </div>

        <div className="flex gap-2 my-5">
          {["all", "confirmed", "pending", "cancelled"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize cursor-pointer ${statusFilter === s ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
            >
              {s === "all"
                ? `All (${bookings.length})`
                : `${s} (${bookings.filter((b) => b.Status?.toLowerCase() === s).length})`}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "Booking ID",
                    "Client",
                    "Package",
                    "Destination",
                    "Employee",
                    "Date",
                    "Pax",
                    "Status",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-12 text-slate-400"
                    >
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr
                      key={b.BookingID}
                      className="border-t border-slate-50 hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-3 font-medium text-blue-600">
                        BK-{String(b.BookingID).padStart(4, "0")}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {b.Client?.Name || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {b.Package?.Name || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {b.Package?.Destination || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {b.Employee?.Name || "—"}
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {b.BookingDate}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{b.PaxCount}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[b.Status?.toLowerCase()] || "bg-slate-100 text-slate-600"}`}
                        >
                          {b.Status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
