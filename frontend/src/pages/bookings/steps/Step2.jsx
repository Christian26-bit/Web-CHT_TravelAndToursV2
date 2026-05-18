import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step2({ bookingData, updateData, onNext, onBack }) {
  const [packages, setPackages] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/tour-packages");
        if (res.data.success) setPackages(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setPackagesLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const selectPackage = (pkg) => {
    updateData({
      packageId: pkg.PackageID,
      packageName: pkg.Name,
      packagePrice: pkg.Price,
      destination: pkg.Destination || "",
    });
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Tour Packages Section */}
      {/* Tour Packages Section */}
      <div className="flex flex-col gap-[24px]">
        <div className="flex flex-col items-start gap-[8px] max-w-full w-full">
          <h2 className="font-['Arimo-Regular',Helvetica] text-[16px] text-[#1e293b] leading-[24px] m-0">
            Select Tour Package
          </h2>
          <p className="font-['Arimo-Regular',Helvetica] text-[16px] text-[#64748b] leading-[24px] m-0">
            Choose a package that best fits your customer's preferences
          </p>

          {/* Interview Tip */}
          <div className="flex items-center h-[42px] px-[13px] mt-[8px] rounded-[8px] border border-[#e2e8f0] bg-[rgba(239,246,255,0.3)] max-w-[840px] w-full">
            <span className="font-['Arimo-Bold',Helvetica] font-bold text-[12px] text-[#64748b] leading-[16px]">
              💬 Interview Tip:
            </span>
            <span className="font-['Arimo-Regular',Helvetica] text-[12px] text-[#64748b] leading-[16px] ml-[4px]">
              Ask about their travel style, budget range, and what activities
              they're interested in. You can customize inclusions in the next
              step.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_minmax(272px,_1fr))] gap-[24px]">
          {packagesLoading
            ? [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[458px] bg-white rounded-[12px] animate-pulse border border-[#e2e8f0]"
                />
              ))
            : packages.map((pkg) => {
                const isSelected = bookingData.packageId === pkg.PackageID;

                const parseList = (data, fallback) => {
                  if (Array.isArray(data)) return data;
                  if (typeof data === "string" && data.trim())
                    return data.split(",").map((s) => s.trim());
                  return fallback;
                };

                const highlights = parseList(pkg.Highlights, [
                  "Mountain Views",
                  "Pine Forest",
                  "Strawberry Farm",
                ]);
                const inclusions = parseList(pkg.Inclusions, [
                  "Hotel Accommodation",
                  "Transportation",
                  "City Tours",
                ]);

                return (
                  <section
                    key={pkg.PackageID}
                    onClick={() => selectPackage(pkg)}
                    className={`relative rounded-[12px] bg-white border border-solid overflow-hidden flex flex-col font-['Arimo-Regular',Helvetica] cursor-pointer ${
                      isSelected
                        ? "border-[#007bff] ring-1 ring-[#007bff]"
                        : "border-[#e2e8f0]"
                    }`}
                  >
                    <div className="p-[25px] flex items-start justify-between">
                      <div className="flex flex-col gap-[4px] flex-1 pr-[16px]">
                        <div className="text-[16px] text-[#1e293b] font-bold leading-[20px]">
                          {pkg.Name}
                        </div>
                        <div className="text-[14px] text-[#64748b] leading-[20px]">
                          {pkg.Destination || "Premier Destination"}
                        </div>
                        <div className="rounded-md bg-[#f1f5f9] px-[9px] py-[3px] w-fit mt-[12px]">
                          <span className="text-[12px] text-[#1e293b] font-medium leading-[16px]">
                            {pkg.Duration} Days /{" "}
                            {Math.max(1, pkg.Duration - 1)} Nights
                          </span>
                        </div>
                      </div>
                      {isSelected ? (
                        <div className="h-[20px] w-[20px] rounded-full bg-[#007bff] flex items-center justify-center shrink-0">
                          <svg
                            className="w-[12px] h-[12px] text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="h-[20px] w-[20px] bg-slate-100 rounded-full shrink-0" />
                      )}
                    </div>

                    <div className="px-[25px] pb-[25px] flex flex-col gap-[16px] mt-auto">
                      <div className="flex items-center gap-[8px]">
                        <div className="text-[24px] text-[#007bff] font-medium">
                          ₱{parseFloat(pkg.Price || 0).toLocaleString()}
                        </div>
                        <div className="text-[14px] text-[#64748b]">
                          base price
                        </div>
                      </div>

                      <div className="flex flex-col gap-[8px]">
                        <div className="text-[14px] text-[#1e293b] leading-[20px]">
                          Highlights:
                        </div>
                        <div className="flex flex-wrap gap-[8px] text-[12px]">
                          {highlights.slice(0, 3).map((hl, i) => (
                            <div
                              key={i}
                              className="rounded-md border border-[#e2e8f0] px-[8px] py-[2px] whitespace-nowrap text-[#1e293b]"
                            >
                              {hl}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-[8px]">
                        <div className="text-[14px] text-[#1e293b] leading-[20px]">
                          Inclusions:
                        </div>
                        <div className="flex flex-col gap-[4px] text-[14px] text-[#64748b]">
                          {inclusions.slice(0, 3).map((inc, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-[8px]"
                            >
                              <svg
                                className="w-[16px] h-[16px] text-[#00c950] shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span className="truncate">{inc}</span>
                            </div>
                          ))}
                          {inclusions.length > 3 && (
                            <div className="text-[12px] ml-[24px] text-[#64748b]">
                              +{inclusions.length - 3} more inclusions
                            </div>
                          )}
                        </div>
                      </div>

                      <div
                        className={`mt-[8px] h-[36px] rounded-md border border-[#e2e8f0] flex items-center justify-center gap-[8px] ${isSelected ? "bg-[#007bff] text-white border-transparent" : "bg-white text-[#1e293b] hover:bg-slate-50"}`}
                      >
                        {isSelected ? (
                          <span className="text-[14px] leading-[20px] font-medium">
                            Selected
                          </span>
                        ) : (
                          <>
                            <svg
                              className="w-[16px] h-[16px]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                            <span className="text-[14px] leading-[20px]">
                              Select & Customize
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(0,123,255,0.05)] to-transparent pointer-events-none" />
                    )}
                  </section>
                );
              })}
        </div>
      </div>

      {/* Bottom Bar: Back / Next */}
      <div className="flex items-center justify-between h-[36px] mt-[24px]">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-[#f8fafc] transition-colors w-[80px]"
        >
          <svg
            className="w-[16px] h-[16px] text-[#1e293b]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[20px]">
            Back
          </span>
        </button>

        <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#64748b] leading-[20px]">
          Step 2 of 6
        </span>

        <button
          onClick={onNext}
          className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-[#007bff] rounded-[6px] hover:bg-[#0069d9] transition-colors w-[80px]"
        >
          <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-white leading-[20px]">
            Next
          </span>
          <svg
            className="w-[16px] h-[16px] text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
