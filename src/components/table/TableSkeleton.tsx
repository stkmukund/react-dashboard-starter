import React from "react";
import { Skeleton } from "../ui";

interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns = 5,
  rows = 5,
}) => {
  return (
    <div className="divide-y divide-border/60">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex items-center px-5 py-4 gap-4">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <div
              key={cIdx}
              className="flex-1 flex items-center gap-3"
            >
              {cIdx === 0 && (
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              )}
              <div className="space-y-1.5 flex-1">
                <Skeleton
                  className={`h-3.5 ${cIdx === 0 ? "w-[70%]" : "w-[85%]"}`}
                />
                {cIdx === 0 && (
                  <Skeleton className="h-2.5 w-[45%]" />
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
