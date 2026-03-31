import React, { useEffect, useState } from "react";
import { BookOpen, Code, FlaskConical } from "lucide-react";
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

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <SectionHeader
            icon={BookOpen}
            title="Laboratories"
            subtitle="Access your interactive experiments and track your technical growth."
          />
          <div className="hidden sm:flex items-center gap-3 bg-card px-4 py-3 rounded-2xl border border-theme-light shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-[#f0f7f5] flex items-center justify-center">
               <FlaskConical className="w-4 h-4 text-[#1a6b5c]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#1a6b5c] uppercase tracking-widest leading-none mb-0.5">{labs.length} Total</p>
              <p className="text-[9px] font-bold text-muted uppercase tracking-tighter leading-none">Curriculums</p>
            </div>
          </div>
        </div>

        {/* Labs Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#1a6b5c] flex items-center justify-center shadow-md">
              <Code className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-black text-heading tracking-tight leading-none mb-1">Available Curriculums</h3>
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest opacity-60">Interactive programming paths</p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card rounded-2xl h-80 border border-theme-light animate-pulse" />
              ))}
            </div>
          ) : labs.length === 0 ? (
            <div className="bg-card rounded-[2.5rem] border border-theme-light shadow-sm p-16 text-center">
              <div className="w-20 h-20 bg-alt rounded-full flex items-center justify-center mx-auto mb-6">
                <FlaskConical className="w-10 h-10 text-muted" />
              </div>
              <h4 className="text-xl font-bold text-heading mb-2">No Labs Found</h4>
              <p className="text-muted max-w-xs mx-auto text-sm leading-relaxed">
                Labs and experiments will appear here only after your faculty schedules them in Lab Management.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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