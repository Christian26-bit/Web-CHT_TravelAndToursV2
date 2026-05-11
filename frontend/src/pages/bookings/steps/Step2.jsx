import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step2({ bookingData, updateData }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/tour-packages");
        if (res.data.success) setPackages(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const selectPackage = (pkg) => {
    updateData({
      packageId: pkg.packageId,
      packageName: pkg.Name,
      packagePrice: pkg.Price,
      totalAmount: pkg.Price * (bookingData.pax || 1),
    });
  };

  if (loading)
    return (
      <div className="py-20 text-center text-slate-400 font-medium">
        Loading packages...
      </div>
    );

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Select Tour Package
        </h2>
        <p className="text-slate-500 mt-1">
          Choose a package that best fits your customer's preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const isSelected = bookingData.packageId === pkg.packageId;
          return (
            <div
              key={pkg.packageId}
              onClick={() => selectPackage(pkg)}
              className={`group bg-white border-2 rounded-[32px] p-8 transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "border-blue-600 shadow-xl shadow-blue-600/10 scale-[1.02]"
                  : "border-slate-100 hover:border-blue-200 hover:shadow-lg"
              }`}
            >
              {isSelected && (
                <div className="absolute top-6 right-6 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg animate-[bounce_0.5s_ease-in-out]">
                  ✓
                </div>
              )}

              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[11px] font-black rounded-full uppercase tracking-widest mb-3 inline-block">
                    {pkg.Destination}
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                    {pkg.Name}
                  </h3>
                </div>

                <div className="space-y-3 mb-8 flex-1">
                  <p className="text-slate-500 text-[14px] line-clamp-3 leading-relaxed">
                    {pkg.Description}
                  </p>
                  <div className="flex items-center gap-4 text-[13px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      🕒 {pkg.Duration}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Price per Person
                    </p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                      ₱{pkg.Price?.toLocaleString()}
                    </p>
                  </div>
                  <button
                    className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Package"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
