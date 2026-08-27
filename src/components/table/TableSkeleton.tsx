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
                <Skeleton variant="circular" width="36px" height="36px" />
              )}
              <div className="space-y-1.5 flex-1">
                <Skeleton
                  variant="text"
                  width={cIdx === 0 ? "70%" : "85%"}
                  height="14px"
                />
                {cIdx === 0 && (
                  <Skeleton variant="text" width="45%" height="10px" />
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
