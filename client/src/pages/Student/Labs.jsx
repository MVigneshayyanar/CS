import React, { useEffect, useState } from "react";
import { BookOpen, Code, FlaskConical, Clock, Target } from "lucide-react";
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

  const totalLabs = labs.length;
  const completedLabs = labs.filter(l => l.progress >= 100).length;
  const inProgressLabs = labs.filter(l => l.progress > 0 && l.progress < 100).length;
  const avgProgress = totalLabs > 0 ? Math.round(labs.reduce((s,l) => s + (l.progress || 0), 0) / totalLabs) : 0;

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <SectionHeader
          icon={BookOpen}
          title="LABS"
          subtitle="Your programming journey and achievements"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {/* Total Labs */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-3 text-center group hover:border-teal-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-50 group-hover:bg-teal-500 transition-colors duration-300">
              <FlaskConical className="w-6 h-6 text-teal-600 group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{totalLabs}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Total Labs</span>
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-3 text-center group hover:border-emerald-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-500 transition-colors duration-300">
              <Target className="w-6 h-6 text-emerald-600 group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{completedLabs}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Completed</span>
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-3 text-center group hover:border-amber-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-amber-50 group-hover:bg-amber-500 transition-colors duration-300">
              <Clock className="w-6 h-6 text-amber-500 group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{inProgressLabs}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">In Progress</span>
            </div>
          </div>

          {/* Avg Progress */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center gap-3 text-center group hover:border-cyan-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-cyan-50 group-hover:bg-cyan-500 transition-colors duration-300">
              <Code className="w-6 h-6 text-cyan-600 group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-slate-800 tracking-tight">{avgProgress}%</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Avg Progress</span>
            </div>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Active Curriculums</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-0.5">Your personalized learning path</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
               <span className="text-xs font-black text-slate-700">{labs.length}</span>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Units Available</span>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
               {[1,2,3].map(i => (
                 <div key={i} className="bg-white rounded-[2rem] h-80 border border-slate-100" />
               ))}
            </div>
          ) : labs.length === 0 ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FlaskConical className="w-10 h-10 text-slate-200" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">No Labs Found</h4>
              <p className="text-slate-400 max-w-xs mx-auto text-sm leading-relaxed">
                You haven't been assigned to any labs yet. Check back later or contact your instructor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {labs.map((lab) => (
                <LabCard key={lab.id} lab={lab} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}