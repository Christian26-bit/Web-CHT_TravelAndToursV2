import { useState } from "react";
import api from "../../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Step6({ bookingData }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFinalize = async () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        clientId: bookingData.clientId,
        packageId: bookingData.packageId,
        hotelId: bookingData.hotelId,
        transportId: bookingData.transportId,
        pax: bookingData.pax,
        travelType: bookingData.travelType,
        specialRequests: bookingData.specialRequests,
        totalAmount: bookingData.totalAmount,
        status: "pending",
      });
      if (res.data.success) {
        alert("Booking finalized successfully!");
        navigate("/user/bookings");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to finalize booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-8 animate-[fadeIn_0.4s_ease-out] pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">
          Review & Confirm
        </h2>
        <p className="text-slate-500 mt-2">
          Please double-check all details before finalizing the booking.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-[40px] p-10 shadow-xl shadow-slate-200/50">
        <div className="space-y-8">
          {/* Customer Info Review */}
          <section>
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" /> Customer
              Information
            </h3>
            <div className="grid grid-cols-2 gap-y-4 px-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  Name
                </p>
                <p className="text-[16px] font-bold text-slate-800">
                  {bookingData.customerName || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  Contact
                </p>
                <p className="text-[16px] font-bold text-slate-800">
                  {bookingData.contact || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  Email
                </p>
                <p className="text-[16px] font-bold text-slate-800">
                  {bookingData.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                  Pax
                </p>
                <p className="text-[16px] font-bold text-slate-800">
                  {bookingData.pax} Person(s)
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Trip Details Review */}
          <section>
            <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full" /> Trip Details
            </h3>
            <div className="space-y-4 px-4">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🧳</span>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      Package
                    </p>
                    <p className="text-[15px] font-bold text-slate-800">
                      {bookingData.packageName || "None selected"}
                    </p>
                  </div>
                </div>
                <p className="text-[16px] font-black text-slate-900">
                  ₱{bookingData.packagePrice?.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-2xl">🏨</span>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      Hotel
                    </p>
                    <p className="text-[15px] font-bold text-slate-800">
                      {bookingData.hotelName || "None"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-2xl">🚐</span>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                      Transport
                    </p>
                    <p className="text-[15px] font-bold text-slate-800">
                      {bookingData.transportName || "None"}
                    </p>
                  </div>
                </div>
              </div>

              {bookingData.selectedAddons?.length > 0 && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-2">
                    Selected Add-ons
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.selectedAddons.map((a) => (
                      <span
                        key={a.id}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[12px] font-bold text-slate-600"
                      >
                        {a.name} (+₱{a.price})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Pricing Summary */}
          <section className="bg-blue-600 rounded-[32px] p-8 text-white shadow-2xl shadow-blue-600/30">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[12px] font-bold opacity-70 uppercase tracking-widest mb-1">
                  Final Estimated Total
                </p>
                <p className="text-[48px] font-black leading-none tracking-tighter">
                  ₱
                  {bookingData.totalAmount.toLocaleString("en-PH", {
                    minimumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="text-right opacity-70">
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  Inclusive of taxes
                </p>
                <p className="text-[11px] font-bold uppercase tracking-widest">
                  and service fees
                </p>
              </div>
            </div>
          </section>

          {/* Terms */}
          <div className="pt-4">
            <label className="flex items-start gap-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-6 h-6 mt-0.5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all group-hover:border-blue-400"
              />
              <span className="text-[14px] font-medium text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                I confirm that all information provided is accurate and the
                customer has agreed to the booking terms and conditions of{" "}
                <span className="font-bold text-slate-800">
                  CHT Travel & Tours
                </span>
                .
              </span>
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handleFinalize}
            disabled={loading || !agreed}
            className={`w-full py-5 rounded-[24px] text-lg font-black uppercase tracking-widest transition-all shadow-xl ${
              agreed && !loading
                ? "bg-green-600 text-white shadow-green-600/20 hover:bg-green-700 hover:-translate-y-1"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Finalizing Booking..." : "Finalize Booking ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}
