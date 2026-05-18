import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step5({ bookingData, updateData, onNext, onBack }) {
  const [transport, setTransport] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const res = await api.get("/transportation");
        if (res.data.success) {
          setTransport(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransport();
  }, []);

  const selectTransport = (t) => {
    const tId = t.VehicleID || t.vehicleId;
    const tType = t.Type || t.type;
    const tPlate = t.PlateNumber || t.plateNumber;
    updateData({
      transportId: tId,
      transportName: `${tType} (${tPlate})`,
    });
  };

  const getVehicleSummary = (list = transport) => {
    if (list.length === 0) return "";
    const counts = list.reduce((acc, t) => {
      const type = t.Type || t.type || "Other";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    const summaryStr = Object.entries(counts)
      .map(([type, count]) => `${count} ${type}${count > 1 && !type.endsWith('s') ? 's' : ''}`)
      .join(", ");
      
    return `: ${summaryStr}`;
  };

  const filteredTransport = transport.filter((t) => {
    if (!bookingData.destination) return true;
    const dest = bookingData.destination.toLowerCase();
    const provider = (t.ProviderName || t.providerName || "").toLowerCase();
    const type = (t.Type || t.type || "").toLowerCase();
    const model = (t.VehicleModel || t.vehicleModel || "").toLowerCase();
    
    const isChinaDest = dest.includes("china") || dest.includes("hong kong") || dest.includes("macau");
    const isChinaVehicle = provider.includes("china") || provider.includes("hong kong") || provider.includes("macau");
    if (isChinaDest && isChinaVehicle) return true;
    if (isChinaDest && !isChinaVehicle) return false;

    const isJapanDest = dest.includes("japan") || dest.includes("hokkaido") || dest.includes("sapporo");
    const isJapanVehicle = provider.includes("japan") || provider.includes("hokkaido") || provider.includes("sapporo");
    if (isJapanDest && isJapanVehicle) return true;
    if (isJapanDest && !isJapanVehicle) return false;

    const isTaiwanDest = dest.includes("taiwan") || dest.includes("taipei") || dest.includes("taichung");
    const isTaiwanVehicle = provider.includes("taiwan") || provider.includes("taipei") || provider.includes("taichung");
    if (isTaiwanDest && isTaiwanVehicle) return true;
    if (isTaiwanDest && !isTaiwanVehicle) return false;

    const isIndoDest = dest.includes("indonesia") || dest.includes("bali") || dest.includes("kuta");
    const isIndoVehicle = provider.includes("indonesia") || provider.includes("bali") || provider.includes("kuta");
    if (isIndoDest && isIndoVehicle) return true;
    if (isIndoDest && !isIndoVehicle) return false;

    return provider.includes(dest) || type.includes(dest) || model.includes(dest);
  });

  const displayTransport = filteredTransport.length > 0 ? filteredTransport : transport;

  return (
    <div className="w-full flex flex-col font-['Arimo-Regular',Helvetica]">
      <div className="flex flex-col gap-[8px] mb-[32px]">
        <h2 className="text-[20px] text-[#1e293b] leading-[30px]">
          Select Transportation
        </h2>
        <p className="text-[16px] text-[#64748b] leading-[24px]">
          Choose a vehicle that fits your group size and preferences
        </p>
        <p className="text-[12px] text-[#64748b] leading-[16px]">
          {bookingData.destination && filteredTransport.length > 0
            ? `Showing ${displayTransport.length} vehicles matching "${bookingData.destination}"`
            : `Showing ${displayTransport.length} vehicles available`
          }
          {getVehicleSummary(displayTransport)}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[32px]">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white border border-[#e2e8f0] rounded-[12px] h-[300px] animate-pulse" />
           ))}
        </div>
      ) : displayTransport.length === 0 ? (
        <div className="p-[40px] text-center border border-[#e2e8f0] rounded-[12px] bg-[#f8fafc] mb-[32px]">
          <span className="text-[14px] text-[#64748b]">No vehicles available</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] mb-[32px]">
          {displayTransport.map((t) => {
            const tId = t.VehicleID || t.vehicleId;
            const isSelected = bookingData.transportId === tId;
            const typeStr = t.Type || t.type || "Vehicle";
            const providerStr = t.ProviderName || t.providerName || "Standard Unit";
            const plateStr = t.PlateNumber || t.plateNumber || "UNIT-XXX";
            const capacityStr = t.Capacity || t.capacity || 0;

            return (
              <div 
                key={tId}
                className={`bg-white border transition-all rounded-[12px] p-[24px] flex flex-col gap-[16px] ${
                  isSelected ? "border-[#007bff] shadow-[0px_4px_10px_rgba(0,123,255,0.15)] relative" : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-[-12px] right-[-12px] w-[24px] h-[24px] bg-[#007bff] rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-[14px] h-[14px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex flex-col items-start gap-[8px]">
                    <div className="border border-[#e2e8f0] rounded-[6px] px-[8px] py-[2px]">
                      <span className="text-[12px] text-[#1e293b] leading-[16px]">{typeStr}</span>
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[16px] text-[#1e293b] leading-[16px] font-medium mb-[4px]">
                        {providerStr}
                      </h3>
                      <p className="text-[14px] text-[#64748b] leading-[20px]">
                        {plateStr}
                      </p>
                    </div>
                  </div>
                  <div className="w-[32px] h-[32px] bg-[#eff6ff] rounded-[8px] flex items-center justify-center shrink-0">
                    <svg className="w-[18px] h-[18px] text-[#007bff]" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
                  </div>
                </div>

                <div className="bg-[#eff6ff]/50 rounded-[8px] p-[12px] flex items-center gap-[8px]">
                  <svg className="w-[20px] h-[20px] text-[#007bff]" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                  <div className="flex flex-col">
                    <span className="text-[14px] text-[#1e293b] leading-[20px]">Capacity</span>
                    <span className="text-[12px] text-[#64748b] leading-[16px]">Up to {capacityStr} passengers</span>
                  </div>
                </div>

                <div className="mt-auto pt-[16px]">
                  <button 
                    onClick={() => selectTransport(t)}
                    className={`w-full h-[36px] flex items-center justify-center rounded-[6px] transition-colors text-[14px] leading-[20px] ${
                      isSelected 
                        ? "bg-[#007bff] text-white hover:bg-[#0069d9]" 
                        : "bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Vehicle"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between h-[36px] mt-auto">
        <button onClick={onBack} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-[#f8fafc] transition-colors w-[80px]">
          <svg className="w-[16px] h-[16px] text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[20px]">Back</span>
        </button>
        
        <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#64748b] leading-[20px]">Step 5 of 6</span>
        
        <button onClick={onNext} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-[#007bff] rounded-[6px] hover:bg-[#0069d9] transition-colors w-[80px]">
          <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-white leading-[20px]">Next</span>
          <svg className="w-[16px] h-[16px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
