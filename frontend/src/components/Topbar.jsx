import { useAuth } from "../context/AuthContextInstance";
import { useLocation } from "react-router-dom";

export default function Topbar() {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) || "AD";

  /**
   * Evaluates the current location pathname to return descriptive, location-aware
   * breadcrumbs, titles, and descriptive subtitles for the Topbar shell.
   */
  const getHeaderInfo = () => {
    if (path.startsWith("/bookings/step/")) {
      const stepNum = parseInt(path.split("/").pop()) || 1;
      const stepLabels = [
        "Customer Info",
        "Package Selection",
        "Customization",
        "Hotel Selection",
        "Transportation",
        "Payment & Confirm"
      ];
      const stepTitle = stepLabels[stepNum - 1] || "Booking Wizard";
      return {
        breadcrumbPage: `New Booking (Step ${stepNum})`,
        title: `Step ${stepNum}: ${stepTitle}`,
        subtitle: `Create New Booking — Progress: ${stepNum} of 6`
      };
    }

    switch (path) {
      case "/user/payments":
        return {
          breadcrumbPage: "Payment",
          title: "Payment Records",
          subtitle: "Manage your Payment Records"
        };
      case "/user/bookings":
        return {
          breadcrumbPage: "Bookings",
          title: "Booking Records",
          subtitle: "Manage your booking schedules and history"
        };
      case "/user/clients":
        return {
          breadcrumbPage: "Clients",
          title: "Client Directory",
          subtitle: "Manage your customer list and accounts"
        };
      case "/user/tour-packages":
        return {
          breadcrumbPage: "Tour Packages",
          title: "Tour Packages",
          subtitle: "Browse premium packages for your next adventure"
        };
      case "/user/dashboard":
        return {
          breadcrumbPage: "Overview",
          title: "Overview",
          subtitle: "Quick insights into travel analytics"
        };
      default: {
        const segments = path.split("/").filter(Boolean);
        const page = segments[1]
          ? segments[1]
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "Overview";
        return {
          breadcrumbPage: page,
          title: page,
          subtitle: `Manage your ${page}`
        };
      }
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <header className="cv-topbar border-none shadow-[0_1px_40px_rgba(0,0,0,0.01)] select-none">
      <div className="flex flex-col gap-[3.993px] items-start py-2" data-node-id="1:2918" data-name="Header">
        <div className="flex gap-[7.986px] items-center text-[14px] leading-[20px] text-[#6a7282] font-['Arimo',sans-serif]" data-node-id="1:2921" data-name="Container">
          <span>Dashboard</span>
          <span className="text-[#cbd5e1]">&gt;</span>
          <span className="font-bold text-[#101828]">{headerInfo.breadcrumbPage}</span>
        </div>
        <h1 className="font-['Arimo',sans-serif] font-normal text-[16px] text-[#101828] leading-[24px]" data-node-id="1:2928" data-name="Heading 1">
          {headerInfo.title}
        </h1>
        <p className="font-['Arimo',sans-serif] text-[14px] text-[#6a7282] leading-[20px]" data-node-id="1:2930" data-name="Paragraph">
          {headerInfo.subtitle}
        </p>
      </div>

    </header>
  );
}
