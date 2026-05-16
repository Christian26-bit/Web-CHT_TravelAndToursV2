import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

export default function Step3({ bookingData, updateData }) {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setAddons([
        {
          id: 1,
          name: "Premium Travel Insurance",
          price: 500,
          description: "Global medical and theft protection for your entire journey.",
        },
        {
          id: 2,
          name: "Elite Airport Lounge",
          price: 1200,
          description: "Exclusive access to catering and refreshments at airport hubs.",
        },
        {
          id: 3,
          name: "Late Check-out",
          price: 800,
          description: "Keep your hotel room until 6:00 PM on your final day.",
        },
        {
          id: 4,
          name: "Private Tour Guide",
          price: 1500,
          description: "Personal professional guide for a deep-dive regional experience.",
        },
      ]);
    });
  }, []);

  const toggleAddon = (addon) => {
    const selectedAddons = bookingData.selectedAddons || [];
    const exists = selectedAddons.find((a) => a.id === addon.id);

    let newAddons;
    if (exists) {
      newAddons = selectedAddons.filter((a) => a.id !== addon.id);
    } else {
      newAddons = [...selectedAddons, addon];
    }

    updateData({
      selectedAddons: newAddons,
    });
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      <div className="text-left">
        <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-4">
          Add-ons
        </h2>
        <p className="text-slate-500 text-[16px] font-medium tracking-tight">
          Enhance your trip with extra services and insurance.
        </p>
      </div>

      {/* Available Services */}
      <Card className="p-10 shadow-sm relative overflow-hidden border-slate-100 rounded-[2rem]">
        <h3 className="text-[14px] font-black text-slate-900 mb-8 uppercase tracking-widest">Available Services</h3>
        <div className="space-y-4">
          {addons.map((addon) => {
            const isSelected = (bookingData.selectedAddons || []).find(
              (a) => a.id === addon.id,
            );
            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon)}
                className={`flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all duration-300 cursor-pointer group relative overflow-hidden ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                    : "border-slate-50 hover:border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary border-transparent text-primary-foreground shadow-md shadow-primary/20"
                        : "border-slate-200 bg-white group-hover:border-primary"
                    }`}
                  >
                    {isSelected && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    )}
                  </div>
                  <div>
                    <p className={`text-[16px] font-black tracking-tight transition-colors ${isSelected ? "text-primary" : "text-slate-900"}`}>
                      {addon.name}
                    </p>
                    <p className="text-[13px] font-medium text-slate-400 mt-1 max-w-md">
                      {addon.description}
                    </p>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <p className="text-[20px] font-black text-slate-900 tracking-tight">
                    ₱{addon.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">
                    Price
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Special Requests */}
      <Card className="p-10 shadow-sm border-slate-100 rounded-[2rem]">
        <h3 className="text-[16px] font-black text-slate-900 mb-2">Special Requests</h3>
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-8">
          Let us know about any special requirements or instructions.
        </p>
        <div className="relative">
           <textarea
             value={bookingData.specialRequests || ""}
             onChange={(e) => updateData({ specialRequests: e.target.value })}
             placeholder="Enter any dietary constraints, mobility requirements, or special instructions..."
             rows="5"
             className="w-full p-8 rounded-[1.5rem] border border-slate-100 bg-slate-50/50 text-slate-900 text-[15px] font-bold outline-none focus:border-primary focus:bg-white transition-all placeholder:text-slate-300 shadow-inner resize-none"
           />
        </div>
      </Card>
    </div>
  );
}
