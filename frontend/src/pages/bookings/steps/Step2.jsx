import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Step2({ bookingData, updateData }) {
  const [packages, setPackages] = useState([]);
  const [flights, setFlights] = useState([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [flightsLoading, setFlightsLoading] = useState(true);
  const [tripType, setTripType] = useState("Round trip");

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
    
    const fetchFlights = async () => {
      try {
        const res = await api.get("/flights");
        if (res.data.success) setFlights(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setFlightsLoading(false);
      }
    };

    fetchPackages();
    fetchFlights();
  }, []);

  const selectPackage = (pkg) => {
    updateData({
      packageId: pkg.PackageID,
      packageName: pkg.Name,
      packagePrice: pkg.Price,
    });
  };

  const getAirlineIcon = (airline) => {
    if (airline?.toLowerCase().includes("skyline")) return "✈️";
    if (airline?.toLowerCase().includes("pacific")) return "🌤️";
    if (airline?.toLowerCase().includes("aero")) return "🌐";
    return "✈️";
  };

  return (
    <div className="space-y-16 animate-fade-in pb-12">
      {/* Tour Packages Section */}
      <div>
        <div className="text-left mb-10">
          <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-4">
            Tour Packages
          </h2>
          <p className="text-slate-500 text-[16px] font-medium tracking-tight">
            Select a tour package for this booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packagesLoading ? (
            [1, 2, 3].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-slate-50" />)
          ) : (
            packages.map((pkg) => {
              const isSelected = bookingData.packageId === pkg.PackageID;
              return (
                <Card
                  key={pkg.PackageID}
                  onClick={() => selectPackage(pkg)}
                  className={`group overflow-hidden border-2 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 rounded-[2rem] ${
                    isSelected ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl"
                  }`}
                >
                  <div className="p-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div className="min-w-0 flex-1">
                        <h4 className={`text-[22px] font-black tracking-tight leading-tight mb-2 truncate block ${isSelected ? "text-primary" : "text-slate-900"}`} title={pkg.Name}>
                          {pkg.Name}
                        </h4>
                        <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest truncate block" title={pkg.Destination || "Premier Destination"}>{pkg.Destination || "Premier Destination"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                      <div className="bg-slate-50 rounded-[1rem] p-4 flex items-center gap-3 transition-colors group-hover:bg-white border border-transparent group-hover:border-slate-100">
                         <div className="text-primary">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                         </div>
                         <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{pkg.Duration} Days</span>
                      </div>
                      <div className="bg-slate-50 rounded-[1rem] p-4 flex items-center gap-3 transition-colors group-hover:bg-white border border-transparent group-hover:border-slate-100">
                         <div className="text-emerald-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                         </div>
                         <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{pkg.MaxPax} Max</span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex justify-between items-center mt-auto">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-1">Total Package</p>
                        <p className="text-[24px] font-black text-slate-900 tracking-tighter leading-none">
                          ₱{parseFloat(pkg.Price || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className={`w-10 h-10 rounded-[0.75rem] flex items-center justify-center transition-all ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-slate-50 text-slate-300"
                      }`}>
                        {isSelected && <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <div className="w-full h-[1px] bg-slate-100" />

      {/* Flights Section */}
      <div>
        <div className="text-left mb-10">
          <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-4">
            Select Flight
          </h2>
          <p className="text-slate-500 text-[16px] font-medium tracking-tight">
            Choose the best flight option for this trip.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Filters */}
          <div className="lg:col-span-3 space-y-8">
            <Card className="p-8 shadow-sm border-slate-100 rounded-[1.5rem]">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Trip Type</h4>
              <div className="space-y-3">
                {["One way", "Round trip", "Multi city"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTripType(t)}
                    className={`w-full text-left h-12 px-6 rounded-xl text-[12px] font-black tracking-widest transition-all duration-300 uppercase
                      ${
                        tripType === t
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "bg-slate-50 text-slate-400 hover:text-slate-900 border border-transparent"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-8 shadow-sm border-slate-100 rounded-[1.5rem]">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6">Service Class</h4>
              <div className="space-y-6">
                {["Economy", "Business", "First Class"].map((s) => (
                  <label key={s} className="flex items-center gap-4 cursor-pointer group">
                    <div className="relative w-5 h-5">
                      <input type="checkbox" className="peer hidden" defaultChecked={s === "Economy"} />
                      <div className="w-5 h-5 rounded-lg border-2 border-slate-200 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
                         <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{s}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-9 space-y-6">
            {flightsLoading ? (
              [1, 2, 3].map((i) => (
                <Card key={i} className="h-40 animate-pulse border-slate-100 rounded-[2rem]"></Card>
              ))
            ) : flights.length === 0 ? (
              <Card className="p-24 text-center border-slate-200 border-dashed rounded-[2rem]">
                <span className="text-[12px] font-black text-slate-300 uppercase tracking-widest">No flights available</span>
              </Card>
            ) : (
              flights.map((f) => {
                const fId = f.FlightId || f.flightId;
                const fAirline = f.airline || f.Airline;
                const fNumber = f.flightNumber || f.FlightNumber;
                const isSelected = bookingData.flightId === fId;
                
                return (
                <Card
                  key={fId}
                  className={`transition-all duration-300 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group overflow-hidden rounded-[2rem] border-2
                  ${
                    isSelected
                      ? "border-primary shadow-xl shadow-primary/10 bg-primary/5"
                      : "border-slate-100 hover:border-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-6 flex-1">
                    <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl group-hover:scale-110 transition-all shadow-sm`}>
                      {getAirlineIcon(fAirline)}
                    </div>
                    <div>
                      <h4 className={`text-[18px] font-black mb-1 ${isSelected ? "text-primary" : "text-slate-900"}`}>{fAirline || "Airline"}</h4>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        {fNumber || `FL-${fId}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 flex-2 justify-center py-4 md:py-0 border-y md:border-y-0 md:border-x border-slate-50 px-8">
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-900 leading-none mb-1">09:00</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MNL</p>
                    </div>
                    <div className="flex flex-col items-center gap-2 min-w-[120px]">
                      <div className="relative w-full h-[1.5px] bg-slate-200">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0011.5 2 1.5 1.5 0 0010 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">3h 45m</span>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-slate-900 leading-none mb-1">12:45</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MPH</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 leading-none mb-1">₱{parseFloat(f.price || 4500).toLocaleString()}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                    </div>
                    <Button
                      variant={isSelected ? "default" : "secondary"}
                      onClick={() =>
                        updateData({
                          flightId: fId,
                          flightNumber: fNumber,
                          airline: fAirline,
                          flightPrice: parseFloat(f.price || 4500),
                        })
                      }
                      className={`h-14 px-10 rounded-[0.75rem] text-[12px] font-black uppercase tracking-widest transition-all
                          ${
                            isSelected
                              ? "shadow-lg shadow-primary/20"
                              : "text-slate-400 hover:text-slate-900"
                          }`}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </Button>
                  </div>
                </Card>
              );
            })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
