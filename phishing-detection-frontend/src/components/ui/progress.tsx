import React from "react";

interface ProgressProps {
  value: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, className }) => (
  <div className={`w-full h-4 bg-gray-200 rounded ${className || ""}`}>
    <div
      className="h-4 bg-blue-500 rounded"
      style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
    />
  </div>
);