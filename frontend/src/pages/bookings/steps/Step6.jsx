import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContextInstance";

export default function Step6({ bookingData, onBack }) {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [paymentType, setPaymentType] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const dashboardPath = user?.role === "admin" ? "/admin/bookings" : "/user/bookings";

  const handleFinalize = async () => {
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
        const bookingId = res.data.data.BookingID || res.data.data.id;
        
        if (paymentStatus === "received") {
          try {
             await api.post("/payments", {
               bookingId: bookingId,
               amount: bookingData.totalAmount,
               paymentDate: paymentDate,
               paymentMethod: paymentType,
               referenceNumber: referenceNumber,
               status: "Completed"
             });
          } catch(err) {
             console.error("Failed to save payment", err);
          }
        }
        
        navigate(dashboardPath);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to finalize booking.");
    } finally {
      setLoading(false);
    }
  };

  const types = ["Cash", "Credit / Debit Card", "Bank Transfer", "E-Wallet"];

  return (
    <div className="w-full flex flex-col gap-[24px]">
      
      <div className="flex-1 bg-white rounded-[12px] border border-[#e2e8f0] p-[32px] flex flex-col">
        <div className="flex flex-col gap-[8px] mb-[32px]">
          <h2 className="text-[20px] text-[#1e293b] leading-[30px]">
            Record Payment
          </h2>
          <p className="text-[16px] text-[#64748b] leading-[24px]">
            Enter the payment details for this booking
          </p>
        </div>

        <div className="flex flex-col gap-[24px]">
          
          <div className="flex flex-col gap-[12px]">
            <label className="text-[16px] text-[#1e293b]">Has the customer paid?</label>
            <div className="flex flex-col gap-[12px]">
              <button 
                onClick={() => setPaymentStatus("received")}
                className={`w-full flex items-center gap-[12px] p-[16px] rounded-[8px] border ${paymentStatus === "received" ? "border-[#007bff] bg-[#eff6ff]/30" : "border-[#e2e8f0] hover:bg-[#f8fafc]"} transition-all text-left`}
              >
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 ${paymentStatus === "received" ? "border-[#007bff]" : "border-slate-300"}`}>
                  {paymentStatus === "received" && <div className="w-[10px] h-[10px] rounded-full bg-[#007bff]" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] text-[#1e293b]">Yes, payment received</span>
                  <span className="text-[14px] text-[#64748b]">Customer has already completed payment</span>
                </div>
              </button>
              
              <button 
                onClick={() => setPaymentStatus("pending")}
                className={`w-full flex items-center gap-[12px] p-[16px] rounded-[8px] border ${paymentStatus === "pending" ? "border-[#007bff] bg-[#eff6ff]/30" : "border-[#e2e8f0] hover:bg-[#f8fafc]"} transition-all text-left`}
              >
                <div className={`w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center shrink-0 ${paymentStatus === "pending" ? "border-[#007bff]" : "border-slate-300"}`}>
                  {paymentStatus === "pending" && <div className="w-[10px] h-[10px] rounded-full bg-[#007bff]" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[16px] text-[#1e293b]">No, payment pending</span>
                  <span className="text-[14px] text-[#64748b]">Customer will pay later</span>
                </div>
              </button>
            </div>
          </div>

          {paymentStatus === "received" && (
            <>
              <div className="flex flex-col gap-[12px] animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[16px] text-[#1e293b]">Payment Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                  {types.map(t => (
                    <button 
                      key={t}
                      onClick={() => setPaymentType(t)}
                      className={`h-[80px] rounded-[8px] border flex flex-col justify-center px-[16px] transition-all text-left ${paymentType === t ? "border-[#007bff] bg-[#eff6ff]/30" : "border-[#e2e8f0] hover:bg-[#f8fafc]"}`}
                    >
                      <div className="w-[24px] h-[24px] rounded-full bg-[#007bff]/10 mb-[8px] flex items-center justify-center">
                        <div className="w-[12px] h-[12px] rounded-full bg-[#007bff]" />
                      </div>
                      <span className="text-[16px] text-[#1e293b] font-medium">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-[8px] animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[14px] text-[#1e293b] leading-[14px]">Payment Date</label>
                <input 
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="h-10 rounded-[6px] border border-[#cbd5e1] px-3 bg-white text-[14px] text-[#1e293b] focus:outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all"
                />
              </div>

              <div className="flex flex-col gap-[8px] animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[14px] text-[#1e293b] leading-[14px]">
                  Reference Number <span className="text-[#94a3b8] ml-[4px]">(Optional)</span>
                </label>
                <input 
                  type="text"
                  placeholder="Transaction ID, receipt number, or check number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="h-10 rounded-[6px] border border-[#cbd5e1] px-3 bg-white text-[14px] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all"
                />
              </div>

              <div className="flex flex-col gap-[8px] animate-in fade-in slide-in-from-top-4 duration-300">
                <label className="text-[14px] text-[#1e293b] leading-[14px]">
                  Notes <span className="text-[#94a3b8] ml-[4px]">(Optional)</span>
                </label>
                <textarea 
                  placeholder="Any additional payment information"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-[80px] rounded-[6px] border border-[#cbd5e1] p-3 bg-white text-[14px] text-[#1e293b] placeholder-[#94a3b8] focus:outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] resize-none transition-all"
                />
              </div>
            </>
          )}

        </div>
      </div>

      <div className="flex items-center justify-between h-[36px] mt-[8px]">
        <button onClick={onBack} disabled={loading} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-[#f8fafc] transition-colors w-[80px]">
          <svg className="w-[16px] h-[16px] text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="text-[14px] text-[#1e293b] leading-[20px]">Back</span>
        </button>
        
        <span className="text-[14px] text-[#64748b] leading-[20px]">Step 6 of 6</span>
        
        <button onClick={handleFinalize} disabled={loading} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-[#007bff] rounded-[6px] hover:bg-[#0069d9] transition-colors disabled:opacity-70">
          {loading ? (
             <div className="w-[16px] h-[16px] border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          ) : (
             <>
               <span className="text-[14px] text-white leading-[20px]">Confirm</span>
               <svg className="w-[16px] h-[16px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
             </>
          )}
        </button>
      </div>
    </div>
  );
}
