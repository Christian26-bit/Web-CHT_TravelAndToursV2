import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import { useAuth } from "../../context/AuthContextInstance";

export default function BookingWizard() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentStep = parseInt(step) || 1;
  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard";

  const [bookingData, setBookingData] = useState({
    clientId: null,
    firstName: "",
    middleName: "",
    lastName: "",
    customerName: "",
    email: "",
    contact: "",
    pax: 1,
    travelType: "Leisure",
    packageId: null,
    packageName: "",
    packagePrice: 0,
    destination: "",
    flightId: null,
    flightNumber: "",
    airline: "",
    hotelId: null,
    hotelName: "",
    transportId: null,
    transportName: "",
    totalAmount: 0,
  });

  const updateData = (newData) => {
    setBookingData((prev) => {
      const updated = { ...prev, ...newData };
      
      const packageTotal = (updated.packagePrice || 0) * (updated.pax || 1);
      const flightTotal = (updated.flightPrice || 0) * (updated.pax || 1);
      const addonsTotal = (updated.selectedAddons || []).reduce((sum, a) => sum + a.price, 0);
      
      updated.totalAmount = packageTotal + flightTotal + addonsTotal;
      return updated;
    });
  };

  const stepLabels = [
    "Customer Info",
    "Package Selection",
    "Customization",
    "Hotel Selection",
    "Transportation",
    "Payment & Confirm"
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 bookingData={bookingData} updateData={updateData} onBack={() => navigate(dashboardPath)} onNext={() => navigate(`/bookings/step/2`)} />;
      case 2: return <Step2 bookingData={bookingData} updateData={updateData} onBack={() => navigate(`/bookings/step/1`)} onNext={() => navigate(`/bookings/step/3`)} />;
      case 3: return <Step3 bookingData={bookingData} updateData={updateData} onBack={() => navigate(`/bookings/step/2`)} onNext={() => navigate(`/bookings/step/4`)} />;
      case 4: return <Step4 bookingData={bookingData} updateData={updateData} onBack={() => navigate(`/bookings/step/3`)} onNext={() => navigate(`/bookings/step/5`)} />;
      case 5: return <Step5 bookingData={bookingData} updateData={updateData} onBack={() => navigate(`/bookings/step/4`)} onNext={() => navigate(`/bookings/step/6`)} />;
      case 6: return <Step6 bookingData={bookingData} updateData={updateData} onBack={() => navigate(`/bookings/step/5`)} onNext={() => navigate(dashboardPath)} />;
      default: return <div className="py-40 text-center animate-pulse text-slate-400 font-semibold uppercase tracking-widest">Loading Step...</div>;
    }
  };

  const completedSteps = Math.min(4, Math.max(0, currentStep - 1));
  const completionPercentage = (completedSteps / 4) * 100;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f8fafc] p-8 pb-20 font-['Arimo-Regular',Helvetica] select-none">
      <div className="flex items-center justify-between h-[100px] max-w-full bg-white border border-[#e2e8f0] px-8 py-6 rounded-[12px] shadow-sm">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <div key={label} className="flex flex-col items-center flex-1 relative">
              <div className="flex items-center w-full">
                <div className={`flex-1 h-[3px] rounded-full ${i === 0 ? "bg-transparent" : (isCompleted || isActive ? "bg-[#007bff]" : "bg-[#f1f5f9]")} transition-all duration-500`} />
                
                <div 
                  className={`flex items-center justify-center w-[40px] h-[40px] rounded-full transition-all duration-300 font-['Arimo-Regular',Helvetica] text-[14px] font-semibold z-10 shrink-0 ${
                    isActive ? "bg-[#007bff] text-white shadow-[0_0_0_4px_rgba(0,123,255,0.15)]" : 
                    isCompleted ? "bg-[#007bff] text-white" : 
                    "bg-[#f1f5f9] text-[#64748b]"
                  }`}
                >
                  {stepNum}
                </div>
                
                <div className={`flex-1 h-[3px] rounded-full ${i === stepLabels.length - 1 ? "bg-transparent" : (isCompleted ? "bg-[#007bff]" : "bg-[#f1f5f9]")} transition-all duration-500`} />
              </div>
              <span className={`font-['Arimo-Regular',Helvetica] text-[11px] font-semibold mt-[12px] whitespace-nowrap transition-colors duration-300 uppercase tracking-wider ${isActive ? "text-[#007bff]" : "text-[#94a3b8]"}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-[32px] mt-[48px] max-w-full">
        <div className="flex-1 min-w-0">
          {renderStep()}
        </div>

        {currentStep <= 6 && (
          <aside className="w-[286px] flex-shrink-0 flex flex-col gap-[24px] border border-[#e2e8f0] rounded-[12px] bg-white shadow-sm sticky top-[97px] overflow-hidden transition-all duration-300">
            <div className="h-[110px] flex flex-col justify-center px-[24px] bg-gradient-to-r from-[#eff6ff]/40 to-white border-b border-[#e2e8f0]">
              <h3 className="text-[18px] font-semibold text-[#1e293b] leading-[28px] tracking-tight">Booking Summary</h3>
              <p className="text-[12px] text-[#64748b] mt-[4px]">Live progress tracker</p>
              <div className="inline-flex items-center justify-center border border-[#eff6ff] rounded-[8px] h-[22px] px-[8px] mt-[10px] w-fit bg-[#eff6ff]">
                <span className="text-[11px] font-semibold text-[#007bff] uppercase tracking-wider">
                  {Math.round(completionPercentage)}% Complete
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[16px] p-[24px] pt-0">
              {[
                { label: "Customer", completed: currentStep > 1 },
                { label: "Package", completed: currentStep > 2 },
                { label: "Hotel", completed: currentStep > 3 },
                { label: "Transport", completed: currentStep > 4 },
              ].map((item, idx) => (
                <div key={item.label} className="flex flex-col gap-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <div className={`flex items-center justify-center w-[22px] h-[22px] rounded-full transition-all duration-300 ${item.completed ? "bg-[#007bff] text-white shadow-sm" : "bg-[#f1f5f9] text-[#cbd5e1]"}`}>
                      {item.completed ? (
                        <svg className="w-[12px] h-[12px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      ) : (
                        <div className="w-[6px] h-[6px] rounded-full bg-[#cbd5e1]" />
                      )}
                    </div>
                    <span className={`text-[14px] font-medium transition-all ${item.completed ? "text-[#1e293b]" : "text-[#94a3b8]"}`}>{item.label}</span>
                  </div>
                  {idx < 3 && <div className="h-[1px] bg-[#e2e8f0]/80 w-full" />}
                </div>
              ))}

              <div className="flex items-center gap-[8px] mt-[8px] border-t border-[#e2e8f0] pt-6">
                <span className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest">Total Cost</span>
              </div>
              <div className="text-[28px] font-bold text-[#007bff] text-right tracking-tight leading-none mt-2">
                ₱{bookingData.totalAmount.toLocaleString()}
              </div>

              <div className="flex flex-col gap-[8px] border-t border-[#e2e8f0] pt-[20px] mt-[8px]">
                <div className="flex justify-between items-center h-[16px]">
                  <span className="text-[11px] font-semibold text-[#cbd5e1] uppercase tracking-widest">Completion</span>
                  <span className="text-[12px] font-semibold text-[#64748b]">{completedSteps} / 4</span>
                </div>
                <div className="w-full h-[8px] bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full bg-[#007bff] transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
