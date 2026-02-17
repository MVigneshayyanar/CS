import React from "react";

const StatusBadge = ({ status }) => {
  switch (status) {
    case "completed":
      return (
        <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
          Completed
        </span>
      );
    case "pending":
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
          Pending
        </span>
      );
    case "overdue":
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Overdue
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          Unknown
        </span>
      );
  }
};

export default StatusBadge;