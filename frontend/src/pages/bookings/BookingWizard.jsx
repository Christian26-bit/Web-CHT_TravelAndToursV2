import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Topbar from "../../components/Topbar";
import Step1 from "./steps/Step1";
import Step2 from "./steps/Step2";
import Step3 from "./steps/Step3";
import Step4 from "./steps/Step4";
import Step5 from "./steps/Step5";
import Step6 from "./steps/Step6";

export default function BookingWizard() {
  const { step } = useParams();
  const navigate = useNavigate();
  const currentStep = parseInt(step) || 1;
  const totalSteps = 6;

  const [bookingData, setBookingData] = useState({
    clientId: null,
    customerName: "",
    email: "",
    contact: "",
    pax: 1,
    travelType: "Leisure",
    packageId: null,
    packageName: "",
    packagePrice: 0,
    hotelId: null,
    hotelName: "",
    transportId: null,
    transportName: "",
    totalAmount: 0,
  });

  const updateData = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const stepLabels = [
    "Customer",
    "Package",
    "Add-ons",
    "Hotel",
    "Transport",
    "Confirm",
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 bookingData={bookingData} updateData={updateData} />;
      case 2:
        return <Step2 bookingData={bookingData} updateData={updateData} />;
      case 3:
        return <Step3 bookingData={bookingData} updateData={updateData} />;
      case 4:
        return <Step4 bookingData={bookingData} updateData={updateData} />;
      case 5:
        return <Step5 bookingData={bookingData} updateData={updateData} />;
      case 6:
        return <Step6 bookingData={bookingData} updateData={updateData} />;
      default:
        return (
          <div className="py-20 text-slate-400 font-medium text-center uppercase tracking-widest">
            Loading Step...
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Topbar />

      <div className="max-w-[1440px] mx-auto p-8">
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 mb-8 shadow-sm">
          <div className="flex justify-between items-center relative px-4">
            <div className="absolute top-[18px] left-10 right-10 h-0.5 bg-slate-100 z-0" />
            <div
              className="absolute top-[18px] left-10 h-0.5 bg-blue-600 z-0 transition-all duration-500"
              style={{
                width: `${((currentStep - 1) / (totalSteps - 1)) * 90}%`,
              }}
            />

            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;

              return (
                <div
                  key={label}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-[0_0_0_4px_rgba(37,99,235,0.15)]"
                        : isCompleted
                          ? "bg-blue-600 text-white"
                          : "bg-white border-2 border-slate-200 text-slate-400"
                    }`}
                  >
                    {isCompleted ? "✓" : stepNum}
                  </div>
                  <span
                    className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`grid grid-cols-1 ${currentStep < 6 ? "lg:grid-cols-[1fr_380px]" : "max-w-[1000px] mx-auto"} gap-8 items-start`}
        >
          <div className="min-h-[500px]">{renderStep()}</div>

          {currentStep < 6 && (
            <aside className="sticky top-28">
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                      Booking Summary
                    </h3>
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full uppercase tracking-tighter">
                      {Math.round((currentStep / totalSteps) * 100)}%
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-400">
                    Review your trip selections
                  </p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100 flex-shrink-0">
                      👤
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Customer
                      </p>
                      <p className="text-[15px] font-bold text-slate-700 truncate">
                        {bookingData.customerName || "Not set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100 flex-shrink-0">
                      🧳
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Package
                      </p>
                      <p className="text-[15px] font-bold text-slate-700 truncate">
                        {bookingData.packageName || "Not selected"}
                      </p>
                    </div>
                  </div>
                  {bookingData.selectedAddons?.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100 flex-shrink-0">
                        ✨
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Add-ons
                        </p>
                        <p className="text-[13px] font-bold text-slate-700">
                          {bookingData.selectedAddons.length} selected
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100 flex-shrink-0">
                      🏨
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Hotel
                      </p>
                      <p className="text-[15px] font-bold text-slate-700 truncate">
                        {bookingData.hotelName || "Not selected"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100 flex-shrink-0">
                      🚐
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Transport
                      </p>
                      <p className="text-[15px] font-bold text-slate-700 truncate">
                        {bookingData.transportName || "Not selected"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-600/20">
                    <p className="text-[36px] font-black mb-1 tracking-tighter">
                      ₱
                      {bookingData.totalAmount.toLocaleString("en-PH", {
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <p className="text-[11px] font-bold opacity-70 uppercase tracking-widest">
                      Estimated Total
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>

        <div className="fixed bottom-0 left-[280px] right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 px-12 py-6 z-40 flex justify-between items-center">
          <button
            onClick={() =>
              currentStep > 1
                ? navigate(`/bookings/step/${currentStep - 1}`)
                : navigate("/user/dashboard")
            }
            className="flex items-center gap-3 px-8 py-3.5 rounded-full border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>{" "}
            {currentStep > 1 ? "Previous Step" : "Cancel Booking"}
          </button>

          <div className="hidden md:flex items-center gap-3">
            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={() =>
              currentStep < totalSteps &&
              navigate(`/bookings/step/${currentStep + 1}`)
            }
            className={`flex items-center gap-3 px-10 py-3.5 rounded-full text-sm font-bold transition-all cursor-pointer group ${
              currentStep === totalSteps
                ? "hidden"
                : "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-0.5"
            }`}
          >
            Next Step{" "}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </div>

      <div className="h-32" />
    </div>
  );
}
