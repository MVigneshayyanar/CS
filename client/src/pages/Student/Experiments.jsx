import React, { useState, useEffect } from "react";
import { Beaker, Search, ArrowLeft, Code } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SectionHeader from "../../components/Student/SectionHeader.jsx";
import ExperimentRow from "../../components/Student/ExperimentRow.jsx";

const sampleExperiments = {
  Java: [
    {
      id: 1,
      sno: 1,
      title: "Java Object-Oriented Programming Fundamentals",
      domain: "OOP Concepts",
      description:
        "Master the core concepts of OOP in Java including classes, objects, inheritance, polymorphism, and encapsulation.",
      status: "completed",
      progress: 100,
      dateDue: "2025-08-15",
      difficulty: "Beginner",
      estimatedTime: "4 hours",
    },
    {
      id: 2,
      sno: 2,
      title: "Java Collections Framework Implementation",
      domain: "Data Structures",
      description:
        "Implement and work with various Java collections including ArrayList, HashMap, and TreeSet with custom comparators.",
      status: "pending",
      progress: 65,
      dateDue: "2025-08-30",
      difficulty: "Intermediate",
      estimatedTime: "8 hours",
    },
    {
      id: 3,
      sno: 3,
      title: "Java Exception Handling and File I/O",
      domain: "Error Handling",
      description:
        "Learn to handle exceptions gracefully and perform file operations using Java I/O streams.",
      status: "pending",
      progress: 0,
      dateDue: "2025-09-15",
      difficulty: "Intermediate",
      estimatedTime: "6 hours",
    },
    {
      id: 4,
      sno: 4,
      title: "Java Multithreading and Concurrency",
      domain: "Threading",
      description:
        "Understand thread creation, synchronization, and concurrent programming in Java.",
      status: "pending",
      progress: 0,
      dateDue: "2025-09-20",
      difficulty: "Advanced",
      estimatedTime: "10 hours",
    },
    {
      id: 5,
      sno: 5,
      title: "Java Database Connectivity (JDBC)",
      domain: "Database",
      description:
        "Connect Java applications to databases using JDBC and perform CRUD operations.",
      status: "overdue",
      progress: 25,
      dateDue: "2025-08-25",
      difficulty: "Intermediate",
      estimatedTime: "7 hours",
    },
  ],
  HTML: [
    {
      id: 8,
      sno: 1,
      title: "HTML5 Semantic Elements",
      domain: "Web Structure",
      description: "Learn modern HTML5 semantic elements for better web structure.",
      status: "completed",
      progress: 100,
      dateDue: "2025-07-30",
      difficulty: "Beginner",
      estimatedTime: "3 hours",
    },
    {
      id: 9,
      sno: 2,
      title: "CSS Grid and Flexbox Layout",
      domain: "CSS Layout",
      description: "Master modern CSS layout techniques with Grid and Flexbox.",
      status: "pending",
      progress: 70,
      dateDue: "2025-09-05",
      difficulty: "Intermediate",
      estimatedTime: "6 hours",
    },
  ],
  Python: [
    {
      id: 10,
      sno: 1,
      title: "Python Function Basics - Factorial Calculator",
      domain: "Python Programming", 
      description: "Learn Python function basics by implementing a factorial calculator with proper error handling.",
      status: "pending",
      progress: 0,
      dateDue: "2025-09-12",
      difficulty: "Beginner",
      estimatedTime: "2 hours",
    },
  ],
};

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
        setTimeout(() => {
          const allExperiments = Object.values(sampleExperiments).flat();
          setExperiments(allExperiments);
          setFilteredExperiments(allExperiments);
          setLoading(false);
        }, 1000);
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
      filtered = sampleExperiments[labFilter] || [];
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
