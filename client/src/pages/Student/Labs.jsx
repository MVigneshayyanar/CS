import React from "react";
import { BookOpen, Code } from "lucide-react";
import SectionHeader from "../../components/Student/SectionHeader.jsx";
import LabCard from "../../components/Student/LabCard.jsx";

const labs = [
  {
    id: 1,
    name: "Java",
    fullName: "JAVA Programming",
    instructor: "NITHYA",
    progress: 85,
    date: "05/10",
    students: 24,
    duration: "3 weeks",
  },
  {
    id: 2,
    name: "C++",
    fullName: "C++ Fundamentals",
    instructor: "SHINY", 
    progress: 78,
    date: "05/10",
    students: 21,
    duration: "4 weeks",
  },
  {
    id: 3,
    name: "HTML",
    fullName: "HTML & Web Development",
    instructor: "KALPANA",
    progress: 92,
    date: "05/10", 
    students: 28,
    duration: "2 weeks",
  },
  {
    id: 4,
    name: "Python",
    fullName: "Python Development",
    instructor: "LALITHA",
    progress: 67,
    date: "05/10",
    students: 25,
    duration: "5 weeks",
  },
];

export default function Labs() {
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
          {labs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      </div>
    </div>
  );
}