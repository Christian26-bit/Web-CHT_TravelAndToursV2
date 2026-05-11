import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step4({ bookingData, updateData }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/hotels");
        if (res.data.success) setHotels(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const selectHotel = (hotel) => {
    updateData({
      hotelId: hotel.hotelId,
      hotelName: hotel.Name,
    });
  };

  if (loading)
    return (
      <div className="py-20 text-center text-slate-400 font-medium">
        Loading hotels...
      </div>
    );

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Select Hotel
        </h2>
        <p className="text-slate-500 mt-1">
          Choose from our curated list of partner hotels and resorts.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {hotels.map((hotel) => {
            const isSelected = bookingData.hotelId === hotel.hotelId;
            return (
              <div
                key={hotel.hotelId}
                onClick={() => selectHotel(hotel)}
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
                    🏨
                  </div>
                  <div>
                    <h3
                      className={`text-[17px] font-bold tracking-tight transition-colors ${
                        isSelected
                          ? "text-blue-700"
                          : "text-slate-800 group-hover:text-blue-600"
                      }`}
                    >
                      {hotel.Name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[12px] text-slate-400 flex items-center gap-1">
                        📍 {hotel.Location || "Various Locations"}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-[12px] text-blue-500 font-bold uppercase tracking-wider">
                        Partner Hotel
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
