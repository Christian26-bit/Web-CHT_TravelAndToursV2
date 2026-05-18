import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function UserPayments() {
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    bookingId: "",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "Cash",
    referenceNumber: "",
    status: "PAID",
  });

  const fetchPayments = async () => {
    try {
      const r = await api.get("/payments");
      if (r.data.success) setPayments(r.data.data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings_list");
      if (res.data.success) setBookings(res.data.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPayments();
      fetchBookings();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (formData.paymentId) {
        await api.put(`/payments/${formData.paymentId}`, formData);
      } else {
        await api.post("/payments", formData);
      }
      setFormOpen(false);
      setFormData({
        bookingId: "",
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: "Cash",
        referenceNumber: "",
        status: "PAID",
      });
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save payment.");
    }
  };

  const handleEditClick = (payment) => {
    setFormData({
      paymentId: payment.paymentId,
      bookingId: payment.BookingID,
      amount: payment.Amount,
      paymentDate: payment.PaymentDate
        ? new Date(payment.PaymentDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      paymentMethod: payment.Method || "Cash",
      referenceNumber: payment.ReferenceNumber || "",
      status: payment.Status?.toUpperCase() || "PAID",
    });
    setFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/payments/${id}`);
      setDeleteConfirm(null);
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete payment.");
      setDeleteConfirm(null);
    }
  };

  const completedPayments = payments.filter(
    (p) => p.Status?.toUpperCase() === "PAID",
  );
  const pendingPayments = payments.filter(
    (p) => p.Status?.toUpperCase() === "PENDING",
  );
  const failedPayments = payments.filter(
    (p) => p.Status?.toUpperCase() === "FAILED",
  );

  const completedTotal = completedPayments.reduce(
    (sum, p) => sum + parseFloat(p.Amount || 0),
    0,
  );
  const pendingTotal = pendingPayments.reduce(
    (sum, p) => sum + parseFloat(p.Amount || 0),
    0,
  );
  const failedTotal = failedPayments.reduce(
    (sum, p) => sum + parseFloat(p.Amount || 0),
    0,
  );

  const totalRevenue = completedTotal + pendingTotal;

  const formatName = (fullName) => {
    if (!fullName) return "Direct Payment";
    const parts = fullName.split("|");
    if (parts.length === 3) {
      const [f, , l] = parts;
      return `${f} ${l}`;
    }
    return fullName.replace(/\|/g, " ").trim();
  };

  const filteredPayments = payments.filter((p) => {
    const clientName = formatName(p.Booking?.Client?.Name || "");
    const bookingRef = `BK-${String(p.BookingID).padStart(4, "0")}`;
    const txnId = `TXN${String(p.paymentId).padStart(6, "0")}`;

    const matchesSearch =
      !searchTerm ||
      txnId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookingRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.ReferenceNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.Status?.toUpperCase() === statusFilter;

    const matchesMethod =
      methodFilter === "ALL" ||
      p.Method?.toLowerCase() === methodFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <section className="flex flex-col w-full h-full min-h-[916px] items-start relative p-8 gap-8 bg-[#f8fafc] animate-fade-in w-full">
      <div className="w-full font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] whitespace-nowrap">
        Payments
      </div>

      <header className="flex w-full flex-col lg:flex-row lg:items-center justify-between gap-4 h-auto lg:h-[68px] w-full">
        <div className="flex flex-col items-start gap-2 lg:gap-[8px]">
          <h1 className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[24px] leading-[36px] whitespace-nowrap">
            Payments Dashboard
          </h1>
          <p className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[16px] leading-[24px] whitespace-nowrap">
            Monitor transaction records, active revenue streams, and status audits.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (formOpen) {
              setFormData({
                bookingId: "",
                amount: "",
                paymentDate: new Date().toISOString().split("T")[0],
                paymentMethod: "Cash",
                referenceNumber: "",
                status: "PAID",
              });
            }
            setFormOpen(!formOpen);
          }}
          className={`flex h-[36px] items-center justify-center gap-[8px] px-[16px] py-[8px] rounded-[6px] transition-all duration-300 cursor-pointer ${
            formOpen
              ? "bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#1e293b]"
              : "bg-[#007bff] hover:bg-[#0069d9] text-white shadow-sm"
          }`}
        >
          {formOpen ? (
            <>
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="font-['Arimo-Regular',Helvetica] font-normal text-[14px] leading-[20px] whitespace-nowrap">
                Close Form
              </span>
            </>
          ) : (
            <>
              <svg className="w-[16px] h-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="font-['Arimo-Regular',Helvetica] font-normal text-[14px] leading-[20px] whitespace-nowrap">
                New Payment
              </span>
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-[24px] min-h-[98px]">
        {[
          {
            title: "Total Revenue",
            value: `₱${totalRevenue.toLocaleString("en-PH")}`,
            bgColor: "bg-[#eff6ff]",
            iconColor: "text-blue-500",
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
          {
            title: "Completed Payments",
            value: `₱${completedTotal.toLocaleString("en-PH")}`,
            bgColor: "bg-[#f0fdf4]",
            iconColor: "text-green-500",
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
          {
            title: "Pending Payments",
            value: `₱${pendingTotal.toLocaleString("en-PH")}`,
            bgColor: "bg-[#fff7ed]",
            iconColor: "text-orange-500",
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
          {
            title: "Failed Payments",
            value: `₱${failedTotal.toLocaleString("en-PH")}`,
            bgColor: "bg-[#faf5ff]",
            iconColor: "text-purple-500",
            icon: (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ),
          },
        ].map((stat, idx) => (
          <article
            key={`${stat.title}-${idx}`}
            className="flex flex-row items-center justify-between w-full p-[24px_24px_24px_24px] bg-white rounded-[12px] border border-solid border-[#e2e8f0]"
          >
            <div className="flex flex-col items-start gap-[4px] flex-1">
              <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[14px] leading-[20px] whitespace-nowrap">
                {stat.title}
              </div>
              <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[16px] leading-[24px] whitespace-nowrap">
                {stat.value}
              </div>
            </div>
            <div className={`w-[48px] h-[48px] rounded-[12px] flex items-center justify-center ${stat.bgColor} ${stat.iconColor}`}>
              {stat.icon}
            </div>
          </article>
        ))}
      </div>

      {formOpen && (
        <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[24px] mb-8 shadow-[0px_1px_2px_rgba(0,0,0,0.05)] animate-fade-in relative overflow-hidden w-full">
          <h3 className="font-['Arimo-Regular',Helvetica] font-medium text-[#1e293b] text-[16px] leading-[24px] mb-[20px]">
            {formData.paymentId ? "Update Payment Record" : "Record New Payment"}
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Select Booking *
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full h-10 px-3 pr-10 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all appearance-none cursor-pointer"
                    value={formData.bookingId}
                    onChange={(e) => {
                      const bId = e.target.value;
                      const selected = bookings.find(
                        (b) => String(b.BookingID) === bId,
                      );
                      setFormData((prev) => ({
                        ...prev,
                        bookingId: bId,
                        amount: selected
                          ? selected.TotalAmount || selected.totalAmount || ""
                          : "",
                      }));
                    }}
                  >
                    <option value="">Select a Reservation...</option>
                    {bookings.map((b) => (
                      <option key={b.BookingID} value={b.BookingID}>
                        BK-{String(b.BookingID).padStart(4, "0")} -{" "}
                        {formatName(b.Client?.Name || b.clientName)} (₱
                        {parseFloat(
                          b.TotalAmount || b.totalAmount || 0,
                        ).toLocaleString("en-PH")}
                        )
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Amount (₱) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Payment Date *
                </label>
                <input
                  type="date"
                  required
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all"
                  value={formData.paymentDate}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Payment Method
                </label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 pr-10 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all appearance-none cursor-pointer"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Reference / Transaction ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. TXN-123456"
                  className="w-full h-10 px-3 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-300"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      referenceNumber: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-['Arimo-Regular',Helvetica] font-normal text-[#64748b] text-[13px] leading-[18px]">
                  Status
                </label>
                <div className="relative">
                  <select
                    className="w-full h-10 px-3 pr-10 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="PAID">Paid / Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex h-[36px] items-center justify-center px-[16px] py-[8px] rounded-[6px] border border-[#cbd5e1] text-[#64748b] hover:text-[#1e293b] hover:bg-slate-50 text-[14px] font-normal transition-all cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="flex h-[36px] items-center justify-center px-[16px] py-[8px] rounded-[6px] bg-[#007bff] hover:bg-[#0069d9] text-white text-[14px] font-normal transition-all cursor-pointer shadow-sm"
              >
                Save Payment
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-solid border-[#e2e8f0] rounded-[12px] p-[16px] flex flex-col lg:flex-row items-center gap-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.05)] w-full animate-fade-in">
        <div className="relative w-full lg:flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <svg
              className="h-[16px] w-[16px] text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#cbd5e1] rounded-[6px] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all placeholder:text-slate-400"
            placeholder="Search payments by Customer, Booking Ref, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="relative w-full lg:w-48">
          <select
            className="w-full h-10 px-3 pr-10 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all appearance-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PAID">Completed / Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        <div className="relative w-full lg:w-48">
          <select
            className="w-full h-10 px-3 pr-10 rounded-[6px] bg-white border border-[#cbd5e1] text-[#1e293b] text-[14px] font-normal outline-none focus:border-[#007bff] focus:ring-1 focus:ring-[#007bff] transition-all appearance-none cursor-pointer"
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
          >
            <option value="ALL">All Methods</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="PayPal">PayPal</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="cv-table-card mt-10">
        <div className="cv-table-container no-scrollbar">
          <table className="cv-table">
            <thead>
              <tr className="border-b border-solid border-[#e2e8f0] h-[40px]">
                <th className="font-normal w-[12%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Payment ID
                  </div>
                </th>
                <th className="font-normal w-[20%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Customer
                  </div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Booking Ref
                  </div>
                </th>
                <th className="font-normal w-[15%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Amount
                  </div>
                </th>
                <th className="font-normal w-[13%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Method
                  </div>
                </th>
                <th className="font-normal w-[12%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Date
                  </div>
                </th>
                <th className="font-normal w-[10%]">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                    Status
                  </div>
                </th>
                <th className="font-normal w-[3%] text-right pr-2">
                  <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] text-right">
                    Actions
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-solid border-[#e2e8f0] h-[39px]"
                  >
                    <td colSpan="8" className="px-[8px]">
                      <div className="h-6 bg-slate-100 animate-pulse rounded w-full animate-duration-1000" />
                    </td>
                  </tr>
                ))
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="py-8 text-center text-slate-500 text-[14px]"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => {
                  const clientName = formatName(p.Booking?.Client?.Name || "");
                  const isPaid = p.Status?.toUpperCase() === "PAID";
                  const isPending = p.Status?.toUpperCase() === "PENDING";

                  return (
                    <tr
                      key={p.paymentId}
                      className="hover:bg-slate-50 transition-colors h-[48px]"
                    >
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                          TXN{String(p.paymentId).padStart(6, "0")}
                        </div>
                      </td>
                      <td>
                        <div
                          className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] truncate max-w-[200px]"
                          title={clientName}
                        >
                          {clientName}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center ml-[8px]">
                          <span className="text-[13px] font-black text-[#007BFF] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                            BK-{String(p.BookingID).padStart(4, "0")}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                          ₱
                          {parseFloat(p.Amount || 0).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px]">
                          {p.Method || "Cash"}
                        </div>
                      </td>
                      <td>
                        <div className="font-['Arimo-Regular',Helvetica] font-normal text-[#1e293b] text-[14px] leading-[20px] ml-[8px] whitespace-nowrap">
                          {new Date(p.PaymentDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center ml-[8px]">
                          <span
                            className={`px-3 py-1 rounded-md text-[11px] font-black uppercase tracking-widest border whitespace-nowrap ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : isPending
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-red-50 text-red-600 border-red-100"
                            }`}
                          >
                            {isPaid
                              ? "Completed"
                              : isPending
                                ? "Pending"
                                : "Failed"}
                          </span>
                        </div>
                      </td>
                      <td className="text-right pr-2">
                        <div className="flex justify-end gap-2.5">
                          <button
                            onClick={() => handleEditClick(p)}
                            title="Edit Payment Record"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#007BFF] hover:border-[#007BFF] hover:bg-blue-50/50 transition-all cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(p.paymentId)}
                            title="Delete Payment Record"
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 transition-all cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.053.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] animate-fade-in animate-duration-200">
          <div className="bg-white rounded-[12px] p-12 shadow-2xl max-w-md w-full mx-4 border border-slate-100">
            <h3 className="font-['Arimo-Regular',Helvetica] font-medium text-[#1e293b] text-[16px] leading-[24px] mb-[20px] tracking-tighter">
              Remove Transaction?
            </h3>
            <p className="text-slate-500 font-medium mb-10 text-[15px] leading-relaxed">
              Are you sure you want to delete this payment record from the system database? This action is irreversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 rounded-[6px] border border-slate-200 text-slate-900 text-[13px] font-black uppercase tracking-widest hover:bg-slate-50 cursor-pointer transition-all"
              >
                Discard
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 h-10 rounded-[6px] bg-red-600 text-white text-[13px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 cursor-pointer transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
