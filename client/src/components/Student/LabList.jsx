// components/Student/LabList.jsx
import React from "react";
import { BookOpen } from "lucide-react";
import LabCard from "./LabCard";

const LabList = ({ labs }) => {
  if (labs.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No labs found"
        description="No labs available at the moment"
      />
    );
  }

  return (
    <div className="space-y-4">
      {labs.map((lab) => (
        <LabCard key={lab.id} lab={lab} />
      ))}
    </div>
  );
};

export default LabList;