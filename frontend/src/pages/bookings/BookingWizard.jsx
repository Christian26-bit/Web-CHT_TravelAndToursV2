import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";
import { useAuth } from "../../context/AuthContextInstance";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function BookingWizard() {
  const { step } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentStep = parseInt(step) || 1;
  const totalSteps = 6;
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

  const stepLabels = ["Traveler", "Trip & Flight", "Add-ons", "Hotel", "Transport", "Review"];

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 bookingData={bookingData} updateData={updateData} />;
      case 2: return <Step2 bookingData={bookingData} updateData={updateData} />;
      case 3: return <Step3 bookingData={bookingData} updateData={updateData} />;
      case 4: return <Step4 bookingData={bookingData} updateData={updateData} />;
      case 5: return <Step5 bookingData={bookingData} updateData={updateData} />;
      case 6: return <Step6 bookingData={bookingData} updateData={updateData} />;
      default: return <div className="py-40 text-center animate-pulse text-slate-400 font-black uppercase tracking-widest">Loading Step...</div>;
    }
  };

  return (
    <div className="cv-main-container animate-fade-in pb-32">
      
      {/* Stepper Navigation */}
      <Card className="p-8 mb-12 shadow-sm border-slate-100 rounded-[2rem]">
        <div className="flex justify-between items-center relative px-6">
          <div className="absolute top-[16px] left-12 right-12 h-[1.5px] bg-slate-100 z-0" />
          <div 
            className="absolute top-[16px] left-12 h-[1.5px] bg-primary z-0 transition-all duration-700 ease-in-out" 
            style={{ width: `calc(${((currentStep - 1) / (totalSteps - 1)) * 100}% - 3rem)` }}
          />

          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={label} className="relative z-10 flex flex-col items-center gap-3">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-black border-2 border-white shadow-sm transition-all duration-500 ${
                    isActive ? "bg-primary text-primary-foreground scale-125 shadow-xl shadow-primary/20" : 
                    isCompleted ? "bg-primary text-primary-foreground" : 
                    "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> : stepNum}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? "text-primary" : "text-slate-300"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className={`grid grid-cols-1 ${currentStep < 6 ? "lg:grid-cols-[1fr_360px]" : "max-w-[1000px] mx-auto"} gap-10 items-start`}>
        {/* Step Content */}
        <div className="min-h-[500px]">
          {renderStep()}
        </div>

        {/* Summary Panel */}
        {currentStep < 6 && (
          <aside className="sticky top-10">
            <Card className="overflow-hidden shadow-2xl shadow-slate-200/50 border-slate-100 rounded-[2rem]">
              <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[17px] font-black text-slate-900 tracking-tight">Booking Summary</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Review your itinerary</p>
              </div>

              <div className="p-8 space-y-6">
                {[
                  { icon: "👤", label: "Traveler", value: bookingData.customerName },
                  { icon: "✈️", label: "Flight", value: bookingData.airline ? `${bookingData.airline} ${bookingData.flightNumber}` : null },
                  { icon: "🧳", label: "Package", value: bookingData.packageName },
                  { icon: "🏨", label: "Hotel", value: bookingData.hotelName },
                  { icon: "🚐", label: "Transport", value: bookingData.transportName },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[20px] transition-transform group-hover:scale-110">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-[14px] font-black text-slate-900 truncate">
                        {item.value || <span className="text-slate-200 font-medium italic">Not selected</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-8 pb-8">
                <div className="rounded-2xl p-6 bg-primary text-primary-foreground relative overflow-hidden shadow-xl shadow-primary/20">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10" />
                  <p className="text-[11px] font-black opacity-70 uppercase tracking-widest mb-2">Total Amount</p>
                  <p className="text-[32px] font-black leading-none tracking-tighter">
                    ₱{bookingData.totalAmount.toLocaleString("en-PH")}
                  </p>
                </div>
              </div>
            </Card>
          </aside>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 flex justify-between items-center z-50 lg:left-[280px]">
        <Button
          variant="outline"
          onClick={() => currentStep > 1 ? navigate(`/bookings/step/${currentStep - 1}`) : navigate(dashboardPath)}
          className="flex items-center gap-3 h-14 px-8 rounded-[0.75rem] border-slate-200 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {currentStep > 1 ? "Previous Step" : "Cancel"}
        </Button>

        <div className="hidden md:flex flex-col items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step {currentStep} of {totalSteps}</span>
          <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-700 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
        </div>

        <Button
          onClick={() => currentStep < totalSteps && navigate(`/bookings/step/${currentStep + 1}`)}
          className={`h-14 px-10 rounded-[0.75rem] text-[12px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 ${
            currentStep === totalSteps ? "hidden" : ""
          }`}
        >
          {currentStep === 1 ? "Start Booking" : "Next Step"} →
        </Button>
      </div>
    </div>
  );
}
