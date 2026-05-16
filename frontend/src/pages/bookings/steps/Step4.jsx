import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      hotelId: hotel.accommodationId || hotel.AccommodationID,
      hotelName: hotel.Name || hotel.name,
    });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-left">
        <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-4">
          Select Hotel
        </h2>
        <p className="text-slate-500 text-[16px] font-medium tracking-tight">
          Select a hotel for the traveler's stay.
        </p>
      </div>

      <Card className="border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-10 h-28 bg-white animate-pulse" />
            ))
          ) : hotels.length === 0 ? (
            <div className="p-20 text-center uppercase tracking-[8px] font-black text-slate-200 text-[12px]">
              No hotels discovered
            </div>
          ) : (
            hotels.map((hotel) => {
              const hotelId = hotel.accommodationId || hotel.AccommodationID;
              const isSelected = bookingData.hotelId === hotelId;
              return (
                <div
                  key={hotelId}
                  onClick={() => selectHotel(hotel)}
                  className={`p-10 flex flex-col md:flex-row items-center justify-between gap-8 group cursor-pointer transition-all ${
                    isSelected ? "bg-primary/5" : "hover:bg-slate-50/50"
                  }`}
                >
                  <div className="flex items-center gap-8 flex-1 min-w-0">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all ${
                      isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-primary"
                    }`}>
                      🏨
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-[20px] font-black tracking-tight leading-none mb-3 transition-colors truncate block ${
                        isSelected ? "text-primary" : "text-slate-900 group-hover:text-primary"
                      }`} title={hotel.Name || hotel.name}>
                        {hotel.Name || hotel.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                          <span className="text-[13px] text-slate-400 font-bold group-hover:text-slate-900 transition-colors truncate block" title={hotel.Address || "Location Not Set"}>
                            {hotel.Address || "Location Not Set"}
                          </span>
                        </div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                           Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6 md:mt-0">
                    <Button
                      variant={isSelected ? "default" : "secondary"}
                      className={`h-12 px-8 rounded-[0.75rem] text-[12px] font-black uppercase tracking-widest transition-all
                        ${
                          isSelected
                            ? "shadow-lg shadow-primary/20"
                            : "text-slate-400 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm"
                        }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );
}
