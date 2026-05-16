import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    const tId = t.VehicleID || t.vehicleId;
    const tType = t.Type || t.type;
    const tPlate = t.PlateNumber || t.plateNumber;
    updateData({
      transportId: tId,
      transportName: `${tType} (${tPlate})`,
    });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-left">
        <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-4">
          Select Transport
        </h2>
        <p className="text-slate-500 text-[16px] font-medium tracking-tight">
          Choose a vehicle for the traveler's transportation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="h-64 animate-pulse border-slate-50 rounded-[2rem]" />
          ))
        ) : transport.length === 0 ? (
          <div className="col-span-full p-24 text-center">
            <span className="text-[12px] font-black text-slate-200 uppercase tracking-widest">
              No vehicles available
            </span>
          </div>
        ) : (
          transport.map((t) => {
            const tId = t.VehicleID || t.vehicleId;
            const isSelected = bookingData.transportId === tId;
            return (
              <Card
                key={tId}
                onClick={() => selectTransport(t)}
                className={`group overflow-hidden border-2 transition-all cursor-pointer flex flex-col relative hover:-translate-y-1 rounded-[2rem] ${
                  isSelected
                    ? "border-primary shadow-xl shadow-primary/10 bg-primary/5"
                    : "border-slate-50 hover:border-slate-200 shadow-sm hover:shadow-xl"
                }`}
              >
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-[20px] font-black tracking-tight leading-tight line-clamp-2 mb-2 truncate block ${isSelected ? "text-primary" : "text-slate-900"}`} title={t.Type || t.type}>
                        {t.Type || t.type}
                      </h4>
                      <p className="text-[14px] font-bold text-slate-400 truncate block" title={t.VehicleModel || "Standard Unit"}>
                        {t.VehicleModel || "Standard Unit"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] font-black text-primary bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">
                        {t.PlateNumber || "UNIT-XXX"}
                      </span>
                      <div className="flex items-center gap-2">
                         <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                         <span className="text-[13px] text-slate-400 font-bold group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                            {t.Capacity || 0} Pax
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
                            : "text-slate-400 group-hover:bg-primary group-hover:text-primary-foreground"
                        }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
          )}
        </div>
      </div>
  );
}
