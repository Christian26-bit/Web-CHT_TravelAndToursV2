import { useState, useEffect } from "react";

export default function Step3({ bookingData, updateData }) {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    Promise.resolve().then(() => {
      setAddons([
        {
          id: 1,
          name: "Travel Insurance",
          price: 500,
          description: "Comprehensive coverage for your trip.",
        },
        {
          id: 2,
          name: "Airport Lounge Access",
          price: 1200,
          description: "Relax in comfort before your flight.",
        },
        {
          id: 3,
          name: "Late Check-out",
          price: 800,
          description: "Extend your stay until 4 PM.",
        },
        {
          id: 4,
          name: "Guided City Tour",
          price: 1500,
          description: "4-hour professional guided tour.",
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

    const addonsTotal = newAddons.reduce((sum, a) => sum + a.price, 0);
    const packageTotal =
      (bookingData.packagePrice || 0) * (bookingData.pax || 1);

    updateData({
      selectedAddons: newAddons,
      totalAmount: packageTotal + addonsTotal,
    });
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <div className="text-left">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Customize Your Trip
        </h2>
        <p className="text-slate-500 mt-1">
          Add optional services to enhance your travel experience.
        </p>
      </div>

      {/* Add-ons Selection */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[15px] font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[12px]">
            ✨
          </span>
          Available Add-ons
        </h3>

        <div className="space-y-3">
          {addons.map((addon) => {
            const isSelected = (bookingData.selectedAddons || []).find(
              (a) => a.id === addon.id,
            );
            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon)}
                className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50/30 shadow-sm"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <span className="text-[10px] font-black">✓</span>
                    )}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-slate-800">
                      {addon.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {addon.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[16px] font-black text-slate-900">
                    ₱{addon.price.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    per booking
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Requests */}
      <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
        <h3 className="text-[15px] font-bold text-slate-800 mb-2 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-[12px]">
            📝
          </span>
          Special Requests
        </h3>
        <p className="text-[13px] text-slate-400 mb-5 ml-8">
          Let us know about any dietary restrictions, allergies, or special
          needs.
        </p>
        <textarea
          value={bookingData.specialRequests || ""}
          onChange={(e) => updateData({ specialRequests: e.target.value })}
          placeholder="Type your special requests here..."
          rows="5"
          className="w-full p-6 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-700 text-[15px] outline-none focus:border-blue-500 focus:bg-white transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}
