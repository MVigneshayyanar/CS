import React, { useEffect, useState } from "react";
import { BookOpen, Code } from "lucide-react";
import SectionHeader from "../../components/Student/SectionHeader.jsx";
import LabCard from "../../components/Student/LabCard.jsx";
import { fetchStudentLabs } from "@/services/studentService";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLabs = async () => {
      try {
        const result = await fetchStudentLabs();
        setLabs(result?.data?.labs || []);
      } catch (error) {
        const message = error?.response?.data?.message || "Failed to load labs from backend";
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadLabs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      <div className="max-w-6xl mx-auto px-6 pt-15">
        {/* Header Section */}
        <SectionHeader
          icon={BookOpen}
          title="LABS"
          subtitle="Your programming journey and achievements"
        />
      </div>

      {/* Labs Grid */}
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50 max-w-6xl mx-auto px-6 pt-0 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-600/20 rounded-lg">
            <Code className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">My Lab Progress</h3>
          <div className="ml-auto bg-teal-600/20 text-teal-300 px-3 py-1 rounded-full text-xs font-medium">
            {labs.length} Labs
          </div>
        </div>       
        
        <div className="space-y-4">
          {isLoading && <div className="text-neutral-400">Loading labs...</div>}
          {!isLoading && labs.length === 0 && <div className="text-neutral-500">No labs assigned yet.</div>}
          {labs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
}