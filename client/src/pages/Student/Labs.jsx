import React, { useEffect, useState } from "react";
import { BookOpen, Code, FlaskConical, Clock, Target } from "lucide-react";
import SectionHeader from "../../components/Student/SectionHeader.jsx";
import LabCard from "../../components/Student/LabCard.jsx";
import { fetchStudentLabs } from "@/services/studentService";
import StatsSection from "../../components/Student/StatsSection";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLabs = async () => {
      try {
        const result = await fetchStudentLabs();
        const apiLabs = result?.data?.labs || [];
        const visibleLabs = apiLabs.filter(
          (lab) => Array.isArray(lab.experiments) && lab.experiments.length > 0,
        );
        setLabs(visibleLabs);
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
  const avgProgress = totalLabs > 0 ? Math.round(labs.reduce((s, l) => s + (l.progress || 0), 0) / totalLabs) : 0;

  const stats = [
    { label: "Total Labs", value: totalLabs, color: "teal", icon: FlaskConical },
    { label: "Completed", value: completedLabs, color: "emerald", icon: Target },
    { label: "In Progress", value: inProgressLabs, color: "amber", icon: Clock },
    { label: "Avg Progress", value: `${avgProgress}%`, color: "cyan", icon: Code },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <SectionHeader
          icon={BookOpen}
          title="LABS"
          subtitle="Your programming journey and achievements"
        />

        {/* Stats Section */}
        <div className="mb-12">
          <StatsSection stats={stats} />
        </div>

        {/* Labs Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#2a8c78] flex items-center justify-center shadow-lg shadow-[#2a8c78]/20">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-heading tracking-tight">Active Curriculums</h3>
                <p className="text-xs text-muted font-bold uppercase tracking-widest mt-0.5">Your personalized learning path</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-card px-4 py-2 rounded-2xl border border-theme-light shadow-sm">
              <span className="text-xs font-black text-heading">{labs.length}</span>
              <span className="text-xs font-bold text-muted uppercase tracking-tighter">Units Available</span>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-[2rem] h-80 border border-theme-light" />
              ))}
            </div>
          ) : labs.length === 0 ? (
            <div className="bg-card rounded-[3rem] border border-theme-light shadow-sm p-16 text-center">
              <div className="w-20 h-20 bg-alt rounded-full flex items-center justify-center mx-auto mb-6">
                <FlaskConical className="w-10 h-10 text-muted" />
              </div>
              <h4 className="text-xl font-bold text-heading mb-2">No Labs Found</h4>
              <p className="text-muted max-w-xs mx-auto text-sm leading-relaxed">
                Labs and experiments will appear here only after your faculty schedules them in Lab Management.
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