import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  Edit,
  Filter,
  Plus,
  Save,
  Search,
  Trash2,
  X,
  GraduationCap,
} from "lucide-react";
import {
  createAdminStudent,
  deleteAdminStudent,
  fetchAdminStudents,
  updateAdminStudent,
} from "@/services/adminService";

const currentYear = new Date().getFullYear();
const joiningYearOptions = Array.from(
  { length: 11 },
  (_, i) => currentYear - 10 + i,
); // past 10 years up to current year
const passoutYearOptions = Array.from({ length: 8 }, (_, i) => currentYear + i); // current year + next 7 years

const getBatchLabel = (student) => {
  if (!student?.joiningYear && !student?.passoutYear) return "Unassigned";
  return `${student.joiningYear || "?"} – ${student.passoutYear || "?"}`;
};

const Modal = ({ title, children, onSubmit, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto disabled:opacity-60"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: "",
    email: "",
    rollNo: "",
    joiningYear: "",
    passoutYear: "",
  });

  const resetForm = () => {
    setStudentForm({
      name: "",
      email: "",
      rollNo: "",
      joiningYear: "",
      passoutYear: "",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    resetForm();
  };

  const openCreateModal = () => {
    setEditingStudent(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setStudentForm({
      name: student.name || "",
      email: student.email || "",
      rollNo: student.rollNo || "",
      joiningYear: student.joiningYear || "",
      passoutYear: student.passoutYear || "",
    });
    setShowModal(true);
  };

  const handleSubmitStudent = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStudent) {
        const result = await updateAdminStudent(editingStudent.id, studentForm);
        const updatedStudent = result?.data?.student;
        if (updatedStudent) {
          setStudents((prev) =>
            prev.map((item) =>
              item.id === updatedStudent.id ? updatedStudent : item,
            ),
          );
        }
      } else {
        const result = await createAdminStudent(studentForm);
        const createdStudent = result?.data?.student;
        if (createdStudent) {
          setStudents((prev) => [createdStudent, ...prev]);
          alert(
            `Student created.\nUsername: ${createdStudent.credentials?.username || createdStudent.rollNo}\nPassword: ${createdStudent.credentials?.password || createdStudent.rollNo}`,
          );
        }
      }
      closeModal();
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to save student";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await deleteAdminStudent(studentId);
      setStudents((prev) => prev.filter((item) => item.id !== studentId));
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to delete student";
      alert(message);
    }
  };

  const batchOptions = Array.from(new Set(students.map(getBatchLabel)));

  const filterData = () => {
    return students.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        ["name", "email", "rollNo"].some((field) =>
          item[field]
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        );

      const matchesBatch =
        selectedBatch === "all" || getBatchLabel(item) === selectedBatch;

      return matchesSearch && matchesBatch;
    });
  };

  const filteredStudents = filterData();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const result = await fetchAdminStudents();
        setStudents(result?.data?.students || []);
      } catch (error) {
        const message =
          error?.response?.data?.message ||
          "Failed to fetch students from backend";
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        {/* Hero Header */}
        <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">
                Student Management
              </h1>
              <p className="text-xs text-teal-100">Add and manage students</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="relative z-10 bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Student
          </button>
          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* Search */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-bold text-slate-700">Find Students</p>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {filteredStudents.length} result
              {filteredStudents.length === 1 ? "" : "s"}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>
            <div className="flex items-stretch gap-2">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-600 w-4 h-4" />
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="appearance-none pl-10 pr-9 py-3 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-xl w-full text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="all">Filter: All Batches</option>
                  {batchOptions.map((batch) => (
                    <option key={batch} value={batch}>
                      Filter: {batch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
              </div>
              {selectedBatch !== "all" && (
                <button
                  type="button"
                  onClick={() => setSelectedBatch("all")}
                  className="px-3 py-3 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table — no department/branch column */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400 text-sm"
                    >
                      Loading students...
                    </td>
                  </tr>
                )}
                {!isLoading &&
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-800 font-medium text-sm">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono text-sm">
                        {student.rollNo}
                      </td>
                      <td className="px-6 py-4">
                        {student.joiningYear || student.passoutYear ? (
                          <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full text-xs font-medium">
                            {getBatchLabel(student)}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(student)}
                            className="text-blue-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                {!isLoading && filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-slate-400 text-sm italic"
                    >
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add / Edit Student */}
        {showModal && (
          <Modal
            title={editingStudent ? "Edit Student" : "Add Student"}
            onSubmit={handleSubmitStudent}
            onClose={closeModal}
            isSubmitting={isSubmitting}
          >
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={studentForm.name}
                    onChange={(e) =>
                      setStudentForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="student@email.com"
                    value={studentForm.email}
                    onChange={(e) =>
                      setStudentForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Student ID / Roll Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 22CS101"
                  value={studentForm.rollNo}
                  onChange={(e) =>
                    setStudentForm((prev) => ({
                      ...prev,
                      rollNo: e.target.value,
                    }))
                  }
                  className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Joining Year
                  </label>
                  <select
                    value={studentForm.joiningYear}
                    onChange={(e) =>
                      setStudentForm((prev) => ({
                        ...prev,
                        joiningYear: e.target.value,
                      }))
                    }
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  >
                    <option value="">Select Year</option>
                    {joiningYearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Passout Year
                  </label>
                  <select
                    value={studentForm.passoutYear}
                    onChange={(e) =>
                      setStudentForm((prev) => ({
                        ...prev,
                        passoutYear: e.target.value,
                      }))
                    }
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  >
                    <option value="">Select Year</option>
                    {passoutYearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default StudentManagement;
