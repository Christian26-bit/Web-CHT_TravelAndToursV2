import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step5({ bookingData, updateData }) {
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const res = await api.get("/transportation");
        if (res.data.success) setTransport(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, []);

  const selectTransport = (t) => {
    updateData({
      transportId: t.transportId,
      transportName: `${t.VehicleType} (${t.PlateNumber})`,
    });
  };

  if (loading)
    return (
      <div className="py-20 text-center text-slate-400 font-medium">
        Loading transportation...
      </div>
    );

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Select Transportation
        </h2>
        <p className="text-slate-500 mt-1">
          Choose a vehicle for your customer's group size and comfort.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {transport.map((t) => {
            const isSelected = bookingData.transportId === t.transportId;
            return (
              <div
                key={t.transportId}
                onClick={() => selectTransport(t)}
                className={`p-6 flex items-center justify-between transition-all cursor-pointer group ${
                  isSelected ? "bg-blue-50/50" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm border ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-400 border-slate-100 group-hover:border-blue-200 group-hover:text-blue-600"
                    }`}
                  >
                    🚐
                  </div>
                  <div>
                    <h3
                      className={`text-[17px] font-bold tracking-tight transition-colors ${
                        isSelected
                          ? "text-blue-700"
                          : "text-slate-800 group-hover:text-blue-600"
                      }`}
                    >
                      {t.VehicleType}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[12px] text-slate-400 font-bold tracking-widest uppercase">
                        Plate: {t.PlateNumber}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[12px] text-slate-400">
                        Driver: {t.DriverName || "Assigned Driver"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  {isSelected && (
                    <span className="px-4 py-1.5 bg-blue-600 text-white text-[11px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                      Selected
                    </span>
                  )}
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white group-hover:border-blue-300"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-[10px] font-black">✓</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
