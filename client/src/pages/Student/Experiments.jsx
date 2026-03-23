import React, { useState, useEffect } from "react";
import { Beaker, Search, ArrowLeft, Code } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../components/Student/SectionHeader.jsx";
import ExperimentRow from "../../components/Student/ExperimentRow.jsx";
import { fetchStudentLabs } from "@/services/studentService";

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

    const fetchExperiments = async () => {
      try {
        setLoading(true);
        const result = await fetchStudentLabs();
        const labs = result?.data?.labs || [];
        const allExperiments = labs.flatMap((lab) =>
          (Array.isArray(lab.experiments) ? lab.experiments : []).map((exp, index) => ({
            id: `${lab.id}-${index}`,
            lab: lab.name,
            labKey: lab.name,
            labAlias: lab.language || lab.name,
            sno: index + 1,
            title: exp.title || `Experiment ${index + 1}`,
            domain: exp.domain || lab.name || "General",
            description: exp.description || "No description available",
            status: exp.status || (exp.progress >= 100 ? "completed" : "pending"),
            progress: exp.progress || 0,
            dateDue: exp.deadline || new Date().toISOString().split('T')[0],
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

    fetchExperiments();
  }, [searchParams]);

  useEffect(() => {
    let filtered = experiments;

    // If labFilter is not 'all', filter experiments by lab first
    if (labFilter !== "all") {
      const target = labFilter.toLowerCase();
      filtered = filtered.filter((exp) =>
        (exp.lab || "").toLowerCase() === target ||
        (exp.labAlias || "").toLowerCase() === target ||
        (exp.labKey || "").toLowerCase() === target
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((exp) => exp.status === statusFilter);
    }

    setFilteredExperiments(filtered);
  }, [searchTerm, statusFilter, labFilter, experiments]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-6 pt-15">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Header Section - Same structure as Labs */}
      <div className="max-w-6xl mx-auto px-6 pt-15">
        <SectionHeader
          icon={Beaker}
          title={labFilter !== "all" ? `${labFilter.toUpperCase()} EXPERIMENTS` : "ALL EXPERIMENTS"}
          subtitle={
            labFilter !== "all"
              ? `${labFilter} programming experiments and assignments`
              : "All your laboratory experiments, assignments, and programming projects"
          }
        />
        
        {/* Back to Labs Button */}
        
      </div>

      {/* Main Content Container - Same structure as Labs */}
      <div className="bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-6 border border-neutral-800/50 max-w-6xl mx-auto px-6  pb-12 m-">
        {/* Section Header with Count */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-teal-600/20 rounded-lg">
            <Code className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            {labFilter !== "all" ? `${labFilter} Experiments` : "All Experiments"}
          </h3>
          <div className="ml-auto bg-teal-600/20 text-teal-300 px-3 py-1 rounded-full text-xs font-medium">
            {filteredExperiments.length} Experiments
          </div>
          <div className="justify-end flex">
          <button
            onClick={() => navigate("/labs")}
            className="flex items-center gap-2 text-neutral-400 hover:text-teal-400 transition-colors"
            type="button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Labs
          </button>
        </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search experiments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500 focus:bg-neutral-800"
                  aria-label="Search experiments"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="min-w-[200px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:border-teal-500 focus:bg-neutral-800"
                aria-label="Filter by status"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Experiments Table */}
        <div className="bg-neutral-800/30 rounded-xl border border-neutral-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-700/50 bg-neutral-800/20">
                  <th className="text-left p-6 text-neutral-300 font-semibold">S.No</th>
                  <th className="text-left p-6 text-neutral-300 font-semibold">Title</th>
                  <th className="text-left p-6 text-neutral-300 font-semibold">Domain</th>
                  <th className="text-left p-6 text-neutral-300 font-semibold">Status</th>
                  <th className="text-left p-6 text-neutral-300 font-semibold">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredExperiments.length > 0 ? (
                  filteredExperiments.map((experiment) => (
                    <ExperimentRow key={experiment.id} experiment={experiment} />
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-neutral-400">
                      No experiments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredExperiments.length === 0 && (
          <div className="bg-neutral-800/30 rounded-xl p-12 border border-neutral-700/50 text-center mt-6">
            <Beaker className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No experiments found</h3>
            <p className="text-neutral-400">
              {labFilter !== "all"
                ? `No experiments found for ${labFilter}. Try adjusting your search or filters.`
                : searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Your experiments will appear here once assigned"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Experiments;
