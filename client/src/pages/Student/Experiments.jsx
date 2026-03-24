import React, { useState, useEffect } from "react";
import { Beaker, Search, ArrowLeft, Code, Filter, BookOpen, Clock, Calendar, ChevronRight } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchStudentLabs } from "@/services/studentService";
import StatsSection from "../../components/Student/StatsSection";
import StatCard from "../../components/Student/StatCard";

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
    const labParam = searchParams.get("lab");
    if (labParam) {
      setLabFilter(labParam);
    }

    const fetchExperimentsData = async () => {
      try {
        setLoading(true);
        const result = await fetchStudentLabs();
        const labs = result?.data?.labs || [];
        const allExperiments = labs.flatMap((lab) =>
          (Array.isArray(lab.experiments) ? lab.experiments : []).map((exp, index) => ({
            id: `${lab.id}-${index}`,
            lab: lab.originalName || lab.fullName || lab.name,
            labKey: lab.originalName || lab.fullName || lab.name,
            labAlias: lab.language || lab.name,
            sno: index + 1,
            title: exp.title || `Experiment ${index + 1}`,
            domain: exp.domain || lab.originalName || lab.fullName || lab.name || "General",
            description: exp.description || "No description available",
            status: exp.status || (exp.progress >= 100 ? "completed" : "pending"),
            progress: exp.progress || 0,
            dateDue: exp.deadline || lab.created_at,
            difficulty: exp.difficulty || "Intermediate",
            estimatedTime: exp.estimatedTime || "3 hours",
          }))
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
      const target = labFilter.toLowerCase();
      filtered = filtered.filter((exp) =>
        (exp.lab || "").toLowerCase() === target ||
        (exp.labAlias || "").toLowerCase() === target ||
        (exp.labKey || "").toLowerCase() === target
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
  const pendingCount = filteredExperiments.length - completedCount;
  const avgProgress = filteredExperiments.length > 0 ? Math.round((completedCount / filteredExperiments.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-[1600px] mx-auto px-6 pt-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* LEFT COLUMN: Main List */}
          <div className="flex-1 w-full order-2 lg:order-1">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
                  <Beaker className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5 grayscale-0">
                    {labFilter !== "all" ? `${labFilter} Experiments` : "All Experiments"}
                  </h1>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-teal-500" />
                    Exploring the core concepts of computer science
                  </div>
                </div>
              </div>
            </div>

            {/* Toolbar Inside List */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm mb-10 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="Filter by title, domain or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-transparent text-sm font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                />
              </div>
              <div className="sm:w-px sm:h-8 bg-slate-100 self-center hidden sm:block" />
              <div className="bg-slate-50 px-6 py-3 rounded-2xl flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Found</span>
                <span className="text-sm font-black text-teal-600">{filteredExperiments.length}</span>
              </div>
            </div>

            {/* List */}
            {loading ? (
              <div className="space-y-6 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white rounded-[2.5rem] h-32 border border-slate-100" />
                ))}
              </div>
            ) : filteredExperiments.length === 0 ? (
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-24 text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Beaker className="w-10 h-10 text-slate-200" />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">No results for "{searchTerm}"</h4>
                <p className="text-slate-400 max-w-xs mx-auto text-sm">Try using different keywords or clearing your filters.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredExperiments.map((experiment) => (
                  <div
                    key={experiment.id}
                    onClick={() => navigate(`/labs/experiments/view?id=${experiment.id}`)}
                    className="group bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer flex items-center gap-8"
                  >
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
                      <div className="text-xl font-black text-slate-400 group-hover:text-teal-600 transition-colors">
                        {experiment.sno < 10 ? `0${experiment.sno}` : experiment.sno}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${experiment.status === 'completed' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-amber-500 bg-amber-50 border-amber-100'}`}>
                          {experiment.status}
                        </span>
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{experiment.domain}</span>
                      </div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight group-hover:text-teal-600 transition-colors mb-1 truncate">
                        {experiment.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-1">{experiment.description}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-10 px-8 border-x border-slate-50">
                      <div className="flex flex-col text-center">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Time</span>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{experiment.estimatedTime}</span>
                      </div>
                      <div className="flex flex-col text-center">
                        <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Impact</span>
                        <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{experiment.difficulty}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">
                        <Calendar className="w-3.5 h-3.5 text-teal-500" />
                        {(() => {
                          const d = experiment.dateDue || experiment.deadline;
                          if (!d) return 'N/A';
                          try {
                            const dateObj = new Date(d);
                            return isNaN(dateObj.getTime()) ? d : dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                          } catch (e) {
                            return d;
                          }
                        })()}
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-teal-500 flex items-center justify-center transition-all duration-300">
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Sidebar Stats & Filters */}
          <div className="w-full lg:w-80 order-1 lg:order-2 shrink-0 lg:sticky lg:top-10">
            <div className="space-y-8">

              {/* Back Button */}
              <button
                onClick={() => navigate("/labs")}
                className="w-full flex items-center justify-center gap-3 bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-lg hover:border-teal-300 transition-all duration-300 text-xs font-black text-slate-600 uppercase tracking-widest group"
              >
                <ArrowLeft className="w-4 h-4 text-teal-500 group-hover:-translate-x-1 transition-transform" />
                Back to Lab Portal
              </button>

              {/* Status Filter Card */}
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Filter className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-black tracking-tight mb-6">Execution Status</h3>
                  <div className="flex flex-col gap-3">
                    {['all', 'pending', 'completed'].map(status => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${statusFilter === status ? 'bg-teal-500 shadow-lg shadow-teal-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                      >
                        <span className="text-xs font-black uppercase tracking-widest capitalize">{status}</span>
                        <div className={`w-2 h-2 rounded-full ${status === 'completed' ? 'bg-emerald-400' : status === 'pending' ? 'bg-amber-400' : 'bg-white/40'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total" value={filteredExperiments.length} color="teal" icon={Beaker} />
                <StatCard label="Resolved" value={completedCount} color="emerald" icon={Code} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Pending" value={filteredExperiments.length - completedCount} color="amber" icon={Clock} />
                <StatCard label="Velocity" value={`${avgProgress}%`} color="cyan" icon={Filter} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Experiments;
