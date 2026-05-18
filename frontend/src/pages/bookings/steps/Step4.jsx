import { useState, useEffect } from "react";
import api from "../../../api/axios";

export default function Step4({ bookingData, updateData, onNext, onBack }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await api.get("/hotels");
        if (res.data.success) {
          setHotels(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const selectHotel = (hotel) => {
    const hotelId = hotel.accommodationId || hotel.AccommodationID;
    updateData({
      hotelId: hotelId,
      hotelName: hotel.Name || hotel.name,
    });
  };

  const calculateDuration = () => {
    if (!bookingData.startDate || !bookingData.endDate) return "Not set";
    const start = new Date(bookingData.startDate);
    const end = new Date(bookingData.endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return "Not set";

    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? "Night" : "Nights"}`;
  };

  const parseAmenities = (amenitiesStr) => {
    if (!amenitiesStr) return [];
    return amenitiesStr
      .split(/[;,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const filteredHotels = hotels.filter((hotel) => {
    if (!bookingData.destination) return true;
    const dest = bookingData.destination.toLowerCase();
    const address = (hotel.Address || hotel.address || "").toLowerCase();
    const name = (hotel.Name || hotel.name || "").toLowerCase();

    const isChinaDest =
      dest.includes("china") ||
      dest.includes("hong kong") ||
      dest.includes("macau");
    const isChinaHotel =
      address.includes("china") ||
      address.includes("hong kong") ||
      address.includes("macau") ||
      name.includes("china") ||
      name.includes("hong kong") ||
      name.includes("macau");
    if (isChinaDest && isChinaHotel) return true;
    if (isChinaDest && !isChinaHotel) return false;

    const isJapanDest =
      dest.includes("japan") ||
      dest.includes("hokkaido") ||
      dest.includes("sapporo");
    const isJapanHotel =
      address.includes("japan") ||
      address.includes("hokkaido") ||
      address.includes("sapporo") ||
      name.includes("japan") ||
      name.includes("hokkaido") ||
      name.includes("sapporo");
    if (isJapanDest && isJapanHotel) return true;
    if (isJapanDest && !isJapanHotel) return false;

    const isTaiwanDest =
      dest.includes("taiwan") ||
      dest.includes("taipei") ||
      dest.includes("taichung");
    const isTaiwanHotel =
      address.includes("taiwan") ||
      address.includes("taipei") ||
      address.includes("taichung") ||
      name.includes("taiwan") ||
      name.includes("taipei") ||
      name.includes("taichung");
    if (isTaiwanDest && isTaiwanHotel) return true;
    if (isTaiwanDest && !isTaiwanHotel) return false;

    const isIndoDest =
      dest.includes("indonesia") ||
      dest.includes("bali") ||
      dest.includes("kuta");
    const isIndoHotel =
      address.includes("indonesia") ||
      address.includes("bali") ||
      address.includes("kuta") ||
      name.includes("indonesia") ||
      name.includes("bali") ||
      name.includes("kuta");
    if (isIndoDest && isIndoHotel) return true;
    if (isIndoDest && !isIndoHotel) return false;

    return address.includes(dest) || name.includes(dest);
  });

  const displayHotels = filteredHotels.length > 0 ? filteredHotels : hotels;
  const isFiltered = bookingData.destination && filteredHotels.length > 0;

  return (
    <div className="w-full flex flex-col font-['Arimo-Regular',Helvetica]">
      {/* Header Section */}
      <div className="flex flex-col gap-[8px] mb-[24px]">
        <h2 className="text-[20px] text-[#1e293b] leading-[30px]">
          Select Hotel
        </h2>
        <p className="text-[16px] text-[#64748b] leading-[24px]">
          Choose accommodation based on your customer's destination
        </p>
      </div>

      {/* Booking Context Bar */}
      <div className="bg-[#eff6ff]/50 border border-[#e2e8f0] rounded-[12px] p-[25px] w-full flex flex-col md:flex-row gap-[24px] md:gap-[48px] mb-[24px]">
        <div className="flex flex-col gap-[8px] min-w-[200px]">
          <span className="text-[14px] text-[#1e293b] leading-[14px]">
            Select Location
          </span>
          <div className="bg-white border border-[#cbd5e1] flex items-center justify-between px-[13px] py-[8px] rounded-[6px] w-full">
            <span className="text-[14px] text-[#1e293b] leading-[20px] font-medium truncate">
              {bookingData.destination || "Not set"}
            </span>
            <svg
              className="w-[16px] h-[16px] text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          <span className="text-[12px] text-[#64748b] leading-[16px] mt-[4px]">
            {isFiltered
              ? `Showing ${displayHotels.length} hotels in "${bookingData.destination}"`
              : `Showing ${displayHotels.length} hotels available`}
          </span>
        </div>

        <div className="flex flex-col gap-[8px] min-w-[200px] mt-[4px]">
          <span className="text-[14px] text-[#1e293b] leading-[14px]">
            Travel Dates
          </span>
          <span className="text-[14px] text-[#64748b] leading-[20px] mt-[8px]">
            {bookingData.startDate || "Not set"} -{" "}
            {bookingData.endDate || "Not set"}
          </span>
        </div>

        <div className="flex flex-col gap-[8px] min-w-[200px] mt-[4px]">
          <span className="text-[14px] text-[#1e293b] leading-[14px]">
            Duration
          </span>
          <span className="text-[14px] text-[#64748b] leading-[20px] mt-[8px]">
            {calculateDuration()}
          </span>
        </div>
      </div>

      {/* Hotel Grid Layout */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[32px]">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#e2e8f0] rounded-[12px] p-[25px] h-[200px] animate-pulse"
            />
          ))}
        </div>
      ) : displayHotels.length === 0 ? (
        <div className="p-[40px] text-center border border-[#e2e8f0] rounded-[12px] bg-[#f8fafc] mb-[32px]">
          <span className="text-[14px] text-[#64748b]">
            No hotels discovered
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] mb-[32px]">
          {displayHotels.map((hotel) => {
            const hotelId = hotel.accommodationId || hotel.AccommodationID;
            const hotelName = hotel.Name || hotel.name;
            const isSelected = bookingData.hotelId === hotelId;
            const amenitiesList = parseAmenities(
              hotel.Amenities || hotel.amenities,
            );

            return (
              <div
                key={hotelId}
                className={`bg-white border transition-all rounded-[12px] p-[25px] flex flex-col gap-[20px] ${
                  isSelected
                    ? "border-[#007bff] shadow-[0px_2px_4px_rgba(0,123,255,0.1)]"
                    : "border-[#e2e8f0] hover:border-[#cbd5e1]"
                }`}
              >
                {/* Hotel Title & Location */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-[8px]">
                    <h3 className="text-[16px] text-[#1e293b] leading-[16px] font-medium">
                      {hotelName}
                    </h3>
                    <div className="flex items-center gap-[8px]">
                      <svg
                        className="w-[16px] h-[16px] text-[#64748b]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-[14px] text-[#64748b] leading-[20px]">
                        {hotel.Address || hotel.address || "Location Not Set"}
                      </span>
                    </div>
                  </div>
                  {/* Hotel Icon */}
                  <div className="w-[32px] h-[32px] bg-[#eff6ff] rounded-[8px] flex items-center justify-center">
                    <svg
                      className="w-[18px] h-[18px] text-[#007bff]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                    </svg>
                  </div>
                </div>

                {/* Amenities */}
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[14px] text-[#1e293b] leading-[20px]">
                    Amenities:
                  </span>
                  <div className="flex flex-wrap gap-[8px]">
                    {amenitiesList.length > 0 ? (
                      amenitiesList.map((amenity, idx) => (
                        <div
                          key={idx}
                          className="bg-[#f1f5f9] px-[9px] py-[3px] rounded-[6px]"
                        >
                          <span className="text-[12px] text-[#1e293b] leading-[16px]">
                            {amenity}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[12px] text-[#64748b] italic">
                        No amenities listed
                      </span>
                    )}
                  </div>
                </div>

                {/* Select Button */}
                <div className="mt-auto pt-[20px] border-t border-[#e2e8f0]">
                  <button
                    onClick={() => selectHotel(hotel)}
                    className={`w-full h-[36px] flex items-center justify-center rounded-[6px] transition-colors text-[14px] leading-[20px] ${
                      isSelected
                        ? "bg-[#007bff] text-white hover:bg-[#0069d9]"
                        : "bg-white border border-[#e2e8f0] text-[#1e293b] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select Hotel"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Bar: Back / Next */}
      <div className="flex items-center justify-between h-[36px] mt-auto">
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
          Step 4 of 6
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
