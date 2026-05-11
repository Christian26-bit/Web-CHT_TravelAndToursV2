import { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import api from "../../api/axios";

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchClients = async () => {
      try {
        const res = await api.get("/clients");
        if (res.data.success && isMounted) setClients(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.Name?.toLowerCase().includes(q) || c.Email?.toLowerCase().includes(q)
    );
  });

  const typeColors = {
    REGULAR: "bg-slate-100 text-slate-600",
    CORPORATE: "bg-blue-100 text-blue-700",
    VIP: "bg-amber-100 text-amber-700",
  };

  return (
    <>
      <Topbar />
      <div className="p-8">
        <div className="mb-1">
          <h2 className="text-lg font-bold text-slate-800">Client Directory</h2>
          <p className="text-sm text-slate-500">
            View all registered clients and customers.
          </p>
        </div>

        <div className="flex items-center gap-3 my-5">
          <div className="relative flex-1 max-w-[400px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full cv-table-large">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {[
                    "ID",
                    "Name",
                    "Email",
                    "Contact",
                    "Type",
                    "Date Registered",
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
                      colSpan="6"
                      className="text-center py-12 text-slate-400"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-slate-400"
                    >
                      No clients found
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr
                      key={c.clientId}
                      className="border-t border-slate-50 hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {c.clientId}
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-800">
                        {c.Name}
                      </td>
                      <td className="px-5 py-3 text-slate-600">{c.Email}</td>
                      <td className="px-5 py-3 text-slate-600">
                        {c.ContactNumber}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${typeColors[c.CustomerType] || "bg-slate-100 text-slate-600"}`}
                        >
                          {c.CustomerType}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500">
                        {c.DateRegistered}
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
