import { useEffect } from "react";

const CATEGORIES = [
  {
    id: "accommodation",
    name: "Accommodation",
    items: [
      {
        id: "acc_1",
        name: "Hotel Accommodation",
        description: "4-star hotel with amenities",
        price: 12000,
        isIncluded: true,
      }
    ]
  },
  {
    id: "transport",
    name: "Transport",
    items: [
      {
        id: "trans_1",
        name: "Transportation",
        description: "Airport transfers and local transport",
        price: 5000,
        isIncluded: true,
      }
    ]
  },
  {
    id: "activities",
    name: "Activities",
    items: [
      {
        id: "act_1",
        name: "Island Tours",
        description: "Guided island hopping and tours",
        price: 3500,
        isIncluded: false,
      },
      {
        id: "act_2",
        name: "Island Hopping",
        description: "Full-day island hopping adventure",
        price: 4000,
        isIncluded: true,
      },
      {
        id: "act_3",
        name: "Surf Lessons",
        description: "Professional surf instructor",
        price: 2500,
        isIncluded: false,
      },
      {
        id: "act_4",
        name: "City Tours",
        description: "Half-day city sightseeing",
        price: 2000,
        isIncluded: false,
      }
    ]
  },
  {
    id: "meals",
    name: "Meals",
    items: [
      {
        id: "meal_1",
        name: "Meals (Breakfast & Lunch)",
        description: "Daily breakfast and lunch",
        price: 2000,
        isIncluded: false,
      },
      {
        id: "meal_2",
        name: "All Meals",
        description: "Breakfast, lunch, and dinner",
        price: 4000,
        isIncluded: true,
      },
      {
        id: "meal_3",
        name: "Breakfast",
        description: "Daily breakfast",
        price: 1000,
        isIncluded: false,
      }
    ]
  },
  {
    id: "services",
    name: "Services",
    items: [
      {
        id: "serv_1",
        name: "Tour Guide",
        description: "Professional English-speaking guide",
        price: 1500,
        isIncluded: true,
      },
      {
        id: "serv_2",
        name: "Travel Insurance",
        description: "Basic medical and travel coverage",
        price: 500,
        isIncluded: false,
      }
    ]
  }
];

export default function Step3({ bookingData, updateData, onNext, onBack }) {
  useEffect(() => {
    if (!bookingData.selectedAddons || bookingData.selectedAddons.length === 0) {
      const defaultAddons = [];
      CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
          if (item.isIncluded) {
            defaultAddons.push({
              id: item.id,
              name: item.name,
              price: 0,
              displayPrice: item.price,
              isIncluded: true
            });
          }
        });
      });
      updateData({ selectedAddons: defaultAddons });
    }
  }, []);

  const toggleAddon = (item) => {
    const selectedAddons = bookingData.selectedAddons || [];
    const exists = selectedAddons.find((a) => a.id === item.id);

    let newAddons;
    if (exists) {
      newAddons = selectedAddons.filter((a) => a.id !== item.id);
    } else {
      const addonToSave = {
        id: item.id,
        name: item.name,
        price: item.isIncluded ? 0 : item.price,
        displayPrice: item.price,
        isIncluded: item.isIncluded
      };
      newAddons = [...selectedAddons, addonToSave];
    }

    updateData({
      selectedAddons: newAddons,
    });
  };

  const selectedAddons = bookingData.selectedAddons || [];

  return (
    <div className="w-full flex flex-col font-['Arimo-Regular',Helvetica]">
      <div className="flex flex-col gap-[8px] mb-[24px]">
        <h2 className="text-[20px] text-[#1e293b] leading-[30px]">
          Customize Package
        </h2>
        <p className="text-[16px] text-[#64748b] leading-[24px]">
          Add or remove inclusions to match your customer's needs
        </p>
      </div>

      <div className="bg-[#eff6ff] border border-[#bedbff] rounded-[8px] p-[16px] mb-[32px] flex items-start gap-[12px]">
        <div className="mt-[2px] text-[16px]">💡</div>
        <div className="flex flex-col gap-[4px]">
          <span className="font-bold text-[14px] text-[#193cb8] leading-[20px]">
            E-commerce-style customization:
          </span>
          <span className="text-[14px] text-[#193cb8] leading-[20px]">
            Select or deselect inclusions like adding/removing items from a cart. The price updates in real-time.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-[24px] mb-[32px]">
        {CATEGORIES.map((category) => (
          <div key={category.id} className="bg-white border border-[#e2e8f0] rounded-[12px] p-[25px] flex flex-col gap-[20px]">
            <h3 className="text-[18px] text-[#1e293b] leading-[28px] border-b border-transparent">
              {category.name}
            </h3>

            <div className="flex flex-col gap-[12px]">
              {category.items.map((item) => {
                const isSelected = selectedAddons.some((a) => a.id === item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAddon(item)}
                    className={`border rounded-[8px] p-[12px] pr-[16px] flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? "border-[#007bff] bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)]" : "border-[#e2e8f0] hover:border-[#cbd5e1] bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-[12px]">
                      <div
                        className={`mt-[2px] w-[16px] h-[16px] rounded-[4px] flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "bg-[#007bff] border-[#007bff]" : "bg-[#f8fafc] border border-[#e2e8f0]"
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-[10px] h-[10px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      <div className="flex flex-col gap-[4px]">
                        <div className="flex items-center gap-[8px]">
                          <span className="text-[14px] text-[#1e293b] leading-[20px]">
                            {item.name}
                          </span>
                          {item.isIncluded && (
                            <span className="bg-[#007bff] text-white text-[10px] px-[6px] py-[2px] rounded-[4px] leading-[14px]">
                              Included
                            </span>
                          )}
                        </div>
                        <span className="text-[12px] text-[#64748b] leading-[16px]">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-[12px]">
                      <span className="text-[14px] text-[#1e293b] font-medium leading-[20px]">
                        ₱{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-[1px] bg-slate-100" />

      <div className="bg-white border border-[#e2e8f0] rounded-[12px] p-[25px] flex flex-col gap-[20px] mt-[24px]">
        <div className="flex flex-col gap-[4px]">
          <h3 className="text-[18px] text-[#1e293b] leading-[28px]">Special Requests</h3>
          <p className="text-[14px] text-[#64748b] leading-[20px]">
            Let us know about any special requirements or instructions.
          </p>
        </div>
        <textarea
          value={bookingData.specialRequests || ""}
          onChange={(e) => updateData({ specialRequests: e.target.value })}
          placeholder="Enter any dietary constraints, mobility requirements, or special instructions..."
          rows="4"
          className="w-full p-[16px] rounded-[8px] border border-[#cbd5e1] bg-white text-[#1e293b] text-[14px] font-['Arimo-Regular',Helvetica] outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-[#94a3b8] resize-none"
        />
      </div>

      <div className="flex items-center justify-between h-[36px] mt-[32px]">
        <button onClick={onBack} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-white border border-[#e2e8f0] rounded-[6px] hover:bg-[#f8fafc] transition-colors w-[80px]">
          <svg className="w-[16px] h-[16px] text-[#1e293b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#1e293b] leading-[20px]">Back</span>
        </button>
        
        <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-[#64748b] leading-[20px]">Step 3 of 6</span>
        
        <button onClick={onNext} className="flex items-center justify-center gap-[8px] h-[36px] px-[16px] bg-[#007bff] rounded-[6px] hover:bg-[#0069d9] transition-colors w-[80px]">
          <span className="font-['Arimo-Regular',Helvetica] text-[14px] text-white leading-[20px]">Next</span>
          <svg className="w-[16px] h-[16px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
}
