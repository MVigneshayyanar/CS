import React, { useState, useEffect } from "react";
import { Beaker, Search, ArrowLeft, Code, Filter, BookOpen, Clock, Calendar, ChevronRight } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchStudentLabs } from "@/services/studentService";
import SectionHeader from "../../components/Student/SectionHeader";

const Experiments = () => {
  const [experiments, setExperiments] = useState([]);
  const [filteredExperiments, setFilteredExperiments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [labFilter, setLabFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const labIdParam = searchParams.get("labId");
    if (labIdParam) {
      setLabFilter(labIdParam);
    }

    const fetchExperimentsData = async () => {
      try {
        setLoading(true);
        const result = await fetchStudentLabs();
        const labs = result?.data?.labs || [];
        const allExperiments = labs.flatMap((lab) =>
          (Array.isArray(lab.experiments) ? lab.experiments : []).map((exp, index) => {
            const now = new Date();
            const availableTo = exp.availableTo ? new Date(exp.availableTo) : null;
            const isActuallyExpired = availableTo && now > availableTo;
            
            return {
              id: `${lab.id}-${index}`,
              labId: lab.id,
              lab: lab.name,
              labKey: lab.id,
              labAlias: lab.language || lab.name,
              sno: index + 1,
              title: exp.title || `Experiment ${index + 1}`,
              domain: exp.domain || lab.originalName || lab.fullName || lab.name || "General",
              description: exp.description || "No description available",
              status: exp.status || (exp.progress >= 100 ? "completed" : (isActuallyExpired ? "expired" : "pending")),
              progress: exp.progress || 0,
              dateDue: exp.deadline || exp.availableTo || lab.created_at,
              availableFrom: exp.availableFrom,
              availableTo: exp.availableTo,
              isExpired: isActuallyExpired,
              difficulty: exp.difficulty || "Intermediate",
              estimatedTime: exp.estimatedTime || "3 hours",
            };
          })
        );

        setExperiments(allExperiments);
        setFilteredExperiments(allExperiments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching experiments:", error);
        setLoading(false);
      }
    };

    fetchExperimentsData();
  }, [searchParams]);

  useEffect(() => {
    let filtered = experiments;

    if (labFilter !== "all") {
      filtered = filtered.filter((exp) => 
        exp.labId === labFilter || exp.labKey === labFilter
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((exp) => exp.status === statusFilter);
    }

    setFilteredExperiments(filtered);
  }, [searchTerm, statusFilter, labFilter, experiments]);

  const completedCount = filteredExperiments.filter(e => e.status === "completed").length;
  const avgProgress = filteredExperiments.length > 0 ? Math.round((completedCount / filteredExperiments.length) * 100) : 0;

  const currentLabName = labFilter !== "all" ? (experiments.find(e => e.labId === labFilter)?.lab || "Specific Lab") : "All Experiments";

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <SectionHeader
            icon={Beaker}
            title={currentLabName}
            subtitle="Analyze and implement core concepts through interactive laboratory tasks."
          />
          <button
            onClick={() => navigate("/labs")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-card rounded-xl border border-theme-light shadow-sm hover:border-[#1a6b5c] transition-all text-[11px] font-black text-muted uppercase tracking-widest group shrink-0 self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4 text-[#1a6b5c] group-hover:-translate-x-1 transition-transform" />
            Back to Portal
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
          {/* Main List Column */}
          <div className="space-y-6">
            {/* Search & Toolbar */}
            <div className="bg-card p-2 rounded-2xl border border-theme-light shadow-sm flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  placeholder="Seach by title, domain or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-xs font-bold text-heading placeholder:text-muted/40 outline-none"
                />
              </div>
              <div className="sm:w-px sm:h-8 bg-alt self-center hidden sm:block opacity-50" />
              <div className="px-4 py-3 rounded-xl flex items-center gap-2">
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">Total Found</span>
                <span className="text-xs font-black text-[#1a6b5c] font-mono">{filteredExperiments.length}</span>
              </div>
            </div>

            {/* List Items */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-card rounded-2xl h-24 border border-theme-light animate-pulse" />
                ))}
              </div>
            ) : filteredExperiments.length === 0 ? (
              <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-alt rounded-full flex items-center justify-center mx-auto mb-5">
                  <Beaker className="w-8 h-8 text-muted" />
                </div>
                <h4 className="text-lg font-black text-heading mb-1.5">No Tasks Recorded</h4>
                <p className="text-muted max-w-xs mx-auto text-xs leading-relaxed uppercase tracking-wider opacity-60">
                  Experiments will be listed here once assigned by faculty.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExperiments.map((experiment) => (
                  <div
                    key={experiment.id}
                    onClick={() => navigate(`/labs/experiments/view?id=${experiment.id}`)}
                    className="group bg-card rounded-2xl p-5 border border-theme-light shadow-sm hover:border-[#1a6b5c] transition-all duration-300 cursor-pointer flex items-center gap-6"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#f0f7f5] border border-[#dff2ed] flex items-center justify-center shrink-0 group-hover:bg-[#dff2ed] transition-colors shadow-sm">
                      <div className="text-base font-black text-[#1a6b5c]">
                        {experiment.sno < 10 ? `0${experiment.sno}` : experiment.sno}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${
                          experiment.status === 'completed' 
                            ? 'text-teal-700 bg-teal-50 border-teal-100' 
                            : experiment.status === 'expired' 
                                ? 'text-rose-600 bg-rose-50 border-rose-100' 
                                : 'text-amber-600 bg-amber-50 border-amber-100'
                        }`}>
                          {experiment.status}
                        </span>
                        <span className="text-[9px] font-bold text-muted uppercase tracking-widest opacity-60">{experiment.domain}</span>
                      </div>
                      <h3 className="text-sm font-black text-heading tracking-tight group-hover:text-[#1a6b5c] transition-colors truncate">
                        {experiment.title}
                      </h3>
                      <p className="text-[10px] text-muted font-bold opacity-50 line-clamp-1 mt-0.5">{experiment.description}</p>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 text-[9px] font-black text-muted uppercase tracking-widest mb-1.5 group-hover:text-[#1a6b5c] transition-colors">
                        <Calendar className="w-3.5 h-3.5 opacity-60" />
                        {(() => {
                          const d = experiment.dateDue || experiment.deadline;
                          if (!d) return 'N/A';
                          const dateObj = new Date(d);
                          return isNaN(dateObj.getTime()) ? d : dateObj.toLocaleDateString('en-GB');
                        })()}
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-alt group-hover:bg-[#1a6b5c] flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-4 h-4 text-muted group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Status Filters */}
            <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-6">
              <h3 className="text-xs font-black text-heading uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                 <Filter className="w-3.5 h-3.5 text-[#1a6b5c]" /> Progress Filter
              </h3>
              <div className="flex flex-col gap-2">
                {['all', 'pending', 'expired', 'completed'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 text-left group ${statusFilter === status ? 'bg-[#f0f7f5] border border-[#dff2ed]' : 'bg-alt/50 border border-transparent hover:border-[#1a6b5c]'}`}
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest ${statusFilter === status ? 'text-[#1a6b5c]' : 'text-muted'}`}>{status}</span>
                    <div className={`w-2 h-2 rounded-full shadow-sm ${
                      status === 'completed' ? 'bg-[#1a6b5c]' : 
                      status === 'pending' ? 'bg-amber-400' : 
                      status === 'expired' ? 'bg-rose-400' : 'bg-slate-300'
                    }`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Sidebar stats */}
            <div className="bg-[#1a6b5c] rounded-2xl p-6 shadow-xl shadow-teal-900/10 text-white relative overflow-hidden group">
              <BookOpen className="absolute -bottom-4 -right-4 w-24 h-24 opacity-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-widest text-teal-50/60 mb-1">Overall Lab Progress</p>
                <h4 className="text-4xl font-black font-mono tracking-tighter mb-4">{avgProgress}%</h4>
                
                <div className="flex flex-col gap-2 opacity-90">
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-teal-300" /> Completed</span>
                      <span>{completedCount}</span>
                   </div>
                   <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-amber-300" /> Pending</span>
                      <span>{filteredExperiments.length - completedCount}</span>
                   </div>
                </div>

                <div className="mt-6 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-white h-full rounded-full transition-all duration-1000" style={{ width: `${avgProgress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiments;
