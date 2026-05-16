import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContextInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Step6({ bookingData }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const dashboardPath = user?.role === "admin" ? "/admin/bookings" : "/user/bookings";

  const handleFinalize = async () => {
    if (!agreed) return;
    setLoading(true);
    try {
      const res = await api.post("/bookings", {
        clientId: bookingData.clientId,
        packageId: bookingData.packageId,
        hotelId: bookingData.hotelId,
        transportId: bookingData.transportId,
        flightId: bookingData.flightId,
        pax: bookingData.pax,
        travelType: bookingData.travelType,
        specialRequests: bookingData.specialRequests,
        totalAmount: bookingData.totalAmount,
        status: "pending",
      });
      if (res.data.success) {
        navigate(dashboardPath);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to finalize booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-12 animate-fade-in pb-32">
      <div className="text-center">
        <h2 className="text-[40px] font-black text-slate-900 tracking-tight leading-none mb-4">
          Review & Finalize
        </h2>
        <p className="text-slate-500 text-[18px] font-medium tracking-tight">
          Please review all details before confirming the booking.
        </p>
      </div>

      <Card className="p-12 shadow-2xl shadow-slate-200/40 relative overflow-hidden border-slate-100 rounded-[3rem]">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        <div className="space-y-12">
          {/* Traveler Information */}
          <section>
            <div className="flex items-center gap-4 mb-8">
               <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Traveler Information</h3>
               <div className="h-px flex-1 bg-slate-50"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Full Name</p>
                <p className="text-[18px] font-black text-slate-900 leading-tight break-words">{bookingData.customerName || "—"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Email Address</p>
                <p className="text-[14px] font-bold text-slate-500 truncate" title={bookingData.email}>{bookingData.email || "—"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Persons</p>
                <p className="text-[18px] font-black text-slate-900">{bookingData.pax} Pax</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Travel Type</p>
                <span className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-black rounded-lg uppercase tracking-widest inline-block border border-blue-100 mt-1">
                   {bookingData.travelType}
                </span>
              </div>
            </div>
          </section>

          {/* Booking Details */}
          <section>
            <div className="flex items-center gap-4 mb-8">
               <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest">Booking Details</h3>
               <div className="h-px flex-1 bg-slate-50"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-6 min-w-0">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50 flex-shrink-0">✈️</div>
                     <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Flight</p>
                        <p className="text-[16px] font-black text-slate-900 truncate">{bookingData.airline || "—"} {bookingData.flightNumber || ""}</p>
                     </div>
                  </div>
                  {bookingData.flightPrice && (
                    <p className="text-[16px] font-black text-primary ml-4">₱{parseFloat(bookingData.flightPrice).toLocaleString()}</p>
                  )}
               </div>

               <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-6 min-w-0">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50 flex-shrink-0">🧳</div>
                     <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tour Package</p>
                        <p className="text-[16px] font-black text-slate-900 truncate">{bookingData.packageName || "—"}</p>
                     </div>
                  </div>
                  <p className="text-[16px] font-black text-primary ml-4">₱{parseFloat(bookingData.packagePrice || 0).toLocaleString()}</p>
               </div>

               <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-6 min-w-0">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50 flex-shrink-0">🏨</div>
                     <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hotel</p>
                        <p className="text-[16px] font-black text-slate-900 truncate">{bookingData.hotelName || "—"}</p>
                     </div>
                  </div>
               </div>

               <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-6 min-w-0">
                     <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50 flex-shrink-0">🚐</div>
                     <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Transport</p>
                        <p className="text-[16px] font-black text-slate-900 truncate">{bookingData.transportName || "—"}</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* Total Amount */}
          <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white shadow-xl relative overflow-hidden group mt-10">
             <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -mr-40 -mt-40 transition-transform group-hover:scale-110"></div>
             <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                <div className="text-center md:text-left">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-[4px] mb-4">Total Amount</p>
                   <div className="flex items-baseline gap-4 justify-center md:justify-start">
                      <span className="text-4xl font-black text-primary">₱</span>
                      <span className="text-[72px] font-black tracking-tighter leading-none">
                         {bookingData.totalAmount.toLocaleString()}
                      </span>
                   </div>
                </div>
                <div className="text-center md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-10 md:pt-0 md:pl-12">
                   <p className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-2">Verified Status</p>
                   <p className="text-[14px] font-black text-primary tracking-widest">READY FOR CONFIRMATION</p>
                </div>
             </div>
          </section>

          {/* Confirmation */}
          <div className="pt-8">
            <label className="flex items-start gap-6 cursor-pointer group select-none">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="peer hidden"
                />
                <div className="w-8 h-8 rounded-xl border-2 border-slate-100 bg-white transition-all peer-checked:bg-primary peer-checked:border-transparent flex items-center justify-center group-hover:border-slate-300 shadow-sm">
                   <svg className="w-6 h-6 text-primary-foreground opacity-0 peer-checked:opacity-100 transition-all scale-50 peer-checked:scale-100" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                </div>
              </div>
              <span className="text-[16px] font-medium text-slate-500 leading-relaxed group-hover:text-slate-900 transition-colors">
                I confirm that all information provided is correct and I agree to the terms and conditions for this booking.
              </span>
            </label>
          </div>

          {/* Confirm Button */}
          <div className="pt-10 pb-4">
             <Button
               onClick={handleFinalize}
               disabled={loading || !agreed}
               className={`w-full h-16 rounded-[1.5rem] text-[16px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-4
               ${
                 agreed && !loading
                   ? "shadow-primary/20 hover:-translate-y-1"
                   : "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
               }`}
             >
               {loading ? (
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
               ) : (
                  <>
                    <span>Confirm Booking</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </>
               )}
             </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
