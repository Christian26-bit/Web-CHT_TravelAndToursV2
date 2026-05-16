const JourneyTimeline = ({ milestones }) => {
  if (!milestones || milestones.length === 0)
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          No journey milestones found
        </p>
      </div>
    );

  return (
    <div className="relative pl-8 space-y-12">
      {/* The Vertical Line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

      {milestones.map((m, idx) => {
        const isCompleted = m.isCompleted;
        const isCurrent = m.status === "CURRENT";
        const isPending = !isCompleted && !isCurrent;

        return (
          <div key={m.JourneyId} className="relative">
            {/* Dot */}
            <div
              className={`absolute -left-[29px] top-1.5 w-6 h-6 rounded-full border-4 border-white z-10 flex items-center justify-center shadow-sm
              ${isCompleted ? "bg-blue-600" : isCurrent ? "bg-white border-blue-600 ring-2 ring-blue-100" : "bg-slate-200 border-white"}`}
            >
              {isCompleted && (
                <svg
                  className="w-3 h-3 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
              {isCurrent && (
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
              )}
            </div>

            <div className="flex justify-between items-start">
              <div>
                <h4
                  className={`text-sm font-bold tracking-tight mb-0.5 ${isPending ? "text-slate-400" : "text-slate-900"}`}
                >
                  {m.Title}
                </h4>
                <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-[280px]">
                  {m.Description}
                </p>
                {isCurrent && (
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-0.5 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Currently here
                  </div>
                )}
              </div>
              <div className="text-right">
                <span
                  className={`text-[11px] font-black uppercase tracking-tighter ${isPending ? "text-slate-300" : "text-slate-400"}`}
                >
                  {m.Timestamp
                    ? new Date(m.Timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Today"}
                </span>
                {m.Timestamp && (
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                    {new Date(m.Timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default JourneyTimeline;
