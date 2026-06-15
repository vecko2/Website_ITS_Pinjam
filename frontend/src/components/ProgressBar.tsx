"use client";

import { useEffect, useState } from "react";
import { calcProgress, formatDate } from "@/lib/rental";

export default function ProgressBar({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => setProgress(calcProgress(startDate, endDate));
    update();
    const interval = setInterval(update, 60000); // perbarui tiap menit
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <div className="mt-2">
      <div className="mb-1 flex justify-between text-xs text-slate-500">
        <span>{formatDate(startDate)}</span>
        <span className="font-medium text-[#2E86AB]">{progress}%</span>
        <span>{formatDate(endDate)}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-[#2E86AB] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
