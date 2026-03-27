import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, FlaskConical, Search, Save, X, CheckSquare, Filter, LogOut } from 'lucide-react';
import {
  fetchAdminFaculty,
  fetchAdminStudents,
  fetchAdminLabs,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
} from '@/services/adminService';

/* ───── Reusable Modal Shell ───── */
const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-3xl shadow-xl max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      {children}
      {footer && (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
          {footer}
        </div>
      )}
    </div>
  </div>
);

/* ───── Generate year options ───── */
const currentYear = new Date().getFullYear();
const joiningYearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 10 + i);
const passoutYearOptions = Array.from({ length: 8 }, (_, i) => currentYear + i);

/* ───── Main Component ───── */
const LabManagement = () => {
  const [labs, setLabs] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Create/Edit lab modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [labForm, setLabForm] = useState({
    name: '',
    faculty: [],
    joiningYear: '',
    passoutYear: '',
  });

  // Assign students panel
  const [assigningLab, setAssigningLab] = useState(null);
  const [showStudentPanel, setShowStudentPanel] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [studentFilterYear, setStudentFilterYear] = useState('all');

  // Experiment modal
  const [experimentLab, setExperimentLab] = useState(null);
  const [showExperimentModal, setShowExperimentModal] = useState(false);
  const [experimentForm, setExperimentForm] = useState({
    title: '', description: '', testCases: [{ input: '', expectedOutput: '' }]
  });

  /* ── Data Loading ── */
  const loadData = async () => {
    try {
      const [labsResult, facultyResult, studentsResult] = await Promise.all([
        fetchAdminLabs(), fetchAdminFaculty(), fetchAdminStudents(),
      ]);
      setLabs(labsResult?.data?.labs || []);
      setFaculty(facultyResult?.data?.faculty || []);
      setStudents(studentsResult?.data?.students || []);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /* ── Create / Edit Lab ── */
  const openCreateModal = (lab = null) => {
    setEditingLab(lab);
    if (lab) {
      setLabForm({
        name: lab.name || '',
        faculty: Array.isArray(lab.faculty) ? lab.faculty : (lab.faculty ? [lab.faculty] : []),
        joiningYear: lab.joiningYear || '',
        passoutYear: lab.passoutYear || '',
      });
    } else {
      setLabForm({ name: '', faculty: [], joiningYear: '', passoutYear: '' });
    }
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...labForm,
        // Keep existing students & experiments when editing
        ...(editingLab ? {
          students: editingLab.students || [],
          experiments: editingLab.experiments || [],
        } : {
          students: [],
          experiments: [],
        }),
      };
      if (editingLab) {
        const result = await updateAdminLab(editingLab.id, payload);
        const updated = result?.data?.lab;
        if (updated) setLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
      } else {
        const result = await createAdminLab(payload);
        const created = result?.data?.lab;
        if (created) setLabs(prev => [created, ...prev]);
      }
      setShowCreateModal(false);
      setEditingLab(null);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to save lab');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteLab = async (id) => {
    try {
      await deleteAdminLab(id);
      setLabs(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete lab');
    }
  };

  /* ── Toggle faculty in multi-select ── */
  const toggleFaculty = (name) => {
    setLabForm(prev => ({
      ...prev,
      faculty: prev.faculty.includes(name)
        ? prev.faculty.filter(f => f !== name)
        : [...prev.faculty, name],
    }));
  };

  /* ── Assign Students ── */
  const openStudentPanel = (lab) => {
    setAssigningLab(lab);
    setSelectedStudents(Array.isArray(lab.students) ? [...lab.students] : []);
    setStudentFilterYear('all');
    setShowStudentPanel(true);
  };

  const getFilteredStudents = () => {
    if (studentFilterYear === 'all') return students;
    return students.filter(s => s.year?.toString() === studentFilterYear);
  };

  const toggleStudent = (name) => {
    setSelectedStudents(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const selectAllFiltered = () => {
    const filtered = getFilteredStudents();
    const allNames = filtered.map(s => s.name);
    const allSelected = allNames.every(n => selectedStudents.includes(n));
    if (allSelected) {
      // deselect all filtered
      setSelectedStudents(prev => prev.filter(n => !allNames.includes(n)));
    } else {
      // select all filtered (merge with existing)
      setSelectedStudents(prev => [...new Set([...prev, ...allNames])]);
    }
  };

  const saveStudentAssignment = async () => {
    if (!assigningLab) return;
    setIsSubmitting(true);
    try {
      const payload = { ...assigningLab, students: selectedStudents };
      const result = await updateAdminLab(assigningLab.id, payload);
      const updated = result?.data?.lab;
      if (updated) setLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
      setShowStudentPanel(false);
      setAssigningLab(null);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to assign students');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Experiments ── */
  const openExperimentModal = (lab) => {
    setExperimentLab(lab);
    setExperimentForm({ title: '', description: '', testCases: [{ input: '', expectedOutput: '' }] });
    setShowExperimentModal(true);
  };

  const addTestCase = () => {
    setExperimentForm(prev => ({
      ...prev,
      testCases: [...prev.testCases, { input: '', expectedOutput: '' }],
    }));
  };

  const updateTestCase = (index, field, value) => {
    const updated = [...experimentForm.testCases];
    updated[index][field] = value;
    setExperimentForm(prev => ({ ...prev, testCases: updated }));
  };

  const removeTestCase = (index) => {
    setExperimentForm(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index),
    }));
  };

  const saveExperiment = async () => {
    if (!experimentLab || !experimentForm.title) return;
    setIsSubmitting(true);
    try {
      const newExp = { ...experimentForm, id: Date.now() };
      const payload = {
        ...experimentLab,
        experiments: [...(experimentLab.experiments || []), newExp],
      };
      const result = await updateAdminLab(experimentLab.id, payload);
      const updated = result?.data?.lab;
      if (updated) setLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
      setShowExperimentModal(false);
      setExperimentLab(null);
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to add experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteExperiment = async (lab, expIndex) => {
    setIsSubmitting(true);
    try {
      const updatedExperiments = (lab.experiments || []).filter((_, i) => i !== expIndex);
      const payload = { ...lab, experiments: updatedExperiments };
      const result = await updateAdminLab(lab.id, payload);
      const updated = result?.data?.lab;
      if (updated) setLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Filter labs ── */
  const filteredLabs = searchTerm
    ? labs.filter(l =>
        [l.name, ...(Array.isArray(l.faculty) ? l.faculty : [l.faculty])].some(
          v => v?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : labs;

  /* ── Build unique year combos for student filter ── */
  const uniqueYears = [...new Set(students.map(s => s.year).filter(Boolean))].sort();

  /* ──────────────── RENDER ──────────────── */
  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">

        {/* ── Hero Header ── */}
        <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">Lab Management</h1>
              <p className="text-xs text-teal-100">Create labs, assign students, and manage experiments</p>
            </div>
          </div>
          <button
            onClick={() => openCreateModal()}
            className="relative z-10 bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Lab
          </button>
          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* ── Search ── */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-bold text-slate-700">Find Labs</p>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {filteredLabs.length} result{filteredLabs.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by lab name or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* ── Lab Cards ── */}
        <div className="grid gap-6">
          {isLoading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-400 text-sm text-center shadow-sm">Loading labs...</div>
          )}

          {!isLoading && filteredLabs.map((lab) => {
            const facultyList = Array.isArray(lab.faculty) ? lab.faculty : (lab.faculty ? [lab.faculty] : []);
            return (
              <div key={lab.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                {/* Lab Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-5">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{lab.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>Faculty: {facultyList.join(', ') || '—'}</span>
                      {(lab.joiningYear || lab.passoutYear) && (
                        <span className="bg-teal-50 text-teal-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                          {lab.joiningYear || '?'} – {lab.passoutYear || '?'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 self-end lg:self-start">
                    <button onClick={() => openCreateModal(lab)} className="text-blue-400 hover:text-blue-600 transition-colors p-2 bg-blue-50 rounded-lg hover:bg-blue-100" title="Edit Lab">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteLab(lab.id)} className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg hover:bg-red-100" title="Delete Lab">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Two Sub-Cards: Assign Students & Experiments */}
                <div className="grid md:grid-cols-2 gap-4">

                  {/* ── Assign Students Card ── */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      Assign Students ({(lab.students || []).length})
                    </h4>
                    <div className="flex-1 max-h-28 overflow-y-auto mb-3">
                      {(lab.students || []).length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {lab.students.map((s, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">{s}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No students assigned yet</p>
                      )}
                    </div>
                    {/* Edit button at right bottom */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => openStudentPanel(lab)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* ── Experiments Card ── */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col">
                    <h4 className="font-semibold text-slate-700 mb-3 flex items-center text-sm">
                      <FlaskConical className="w-4 h-4 mr-2" />
                      Experiments ({(lab.experiments || []).length})
                    </h4>
                    <div className="flex-1 max-h-28 overflow-y-auto space-y-2 mb-3">
                      {(lab.experiments || []).length > 0 ? (
                        lab.experiments.map((exp, i) => (
                          <div key={i} className="bg-white border border-slate-200 rounded-lg p-2 flex justify-between items-center">
                            <div>
                              <div className="font-medium text-slate-800 text-xs">{exp.title}</div>
                              <div className="text-[10px] text-slate-400">{(exp.testCases || []).length} test cases</div>
                            </div>
                            <button onClick={() => deleteExperiment(lab, i)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">No experiments</p>
                      )}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => openExperimentModal(lab)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Experiment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!isLoading && filteredLabs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No labs found.</p>
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════
            MODAL: Create / Edit Lab
        ════════════════════════════════════════════════ */}
        {showCreateModal && (
          <Modal
            title={editingLab ? 'Edit Lab' : 'Create Lab'}
            onClose={() => { setShowCreateModal(false); setEditingLab(null); }}
            footer={
              <>
                <button type="button" onClick={() => { setShowCreateModal(false); setEditingLab(null); }} className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto">Cancel</button>
                <button type="button" onClick={handleCreateSubmit} disabled={isSubmitting} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto disabled:opacity-60">
                  <Save className="w-4 h-4 mr-2" />{isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </>
            }
          >
            <div className="space-y-5">
              {/* Lab name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Laboratory Name</label>
                <input
                  type="text"
                  placeholder="e.g. Data Structures Lab"
                  value={labForm.name}
                  onChange={(e) => setLabForm({ ...labForm, name: e.target.value })}
                  className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />
              </div>

              {/* Faculty multi-select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Faculty ({labForm.faculty.length} selected)
                </label>
                <div className="border border-slate-200 rounded-xl p-3 max-h-40 overflow-y-auto bg-slate-50 space-y-1">
                  {faculty.length === 0 && <p className="text-xs text-slate-400 italic p-2">No faculty available</p>}
                  {faculty.map(f => (
                    <label key={f.id} className="flex items-center gap-3 cursor-pointer hover:bg-white p-2.5 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={labForm.faculty.includes(f.name)}
                        onChange={() => toggleFaculty(f.name)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700">{f.name}</span>
                        {f.department && <span className="text-xs text-slate-400 ml-2">· {f.department}</span>}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Year range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Joining Year</label>
                  <select
                    value={labForm.joiningYear}
                    onChange={(e) => setLabForm({ ...labForm, joiningYear: e.target.value })}
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  >
                    <option value="">Select Year</option>
                    {joiningYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Passout Year</label>
                  <select
                    value={labForm.passoutYear}
                    onChange={(e) => setLabForm({ ...labForm, passoutYear: e.target.value })}
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  >
                    <option value="">Select Year</option>
                    {passoutYearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* ════════════════════════════════════════════════
            MODAL: Assign Students (Edit Panel)
        ════════════════════════════════════════════════ */}
        {showStudentPanel && assigningLab && (
          <Modal
            title={`Assign Students — ${assigningLab.name}`}
            onClose={() => { setShowStudentPanel(false); setAssigningLab(null); }}
            footer={
              <>
                <button type="button" onClick={() => { setShowStudentPanel(false); setAssigningLab(null); }} className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
                  <LogOut className="w-4 h-4" />Exit
                </button>
                <button type="button" onClick={saveStudentAssignment} disabled={isSubmitting} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto disabled:opacity-60 gap-2">
                  <Save className="w-4 h-4" />{isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </>
            }
          >
            <div className="space-y-4">
              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <Filter className="w-4 h-4" />
                  Filter by Year:
                </div>
                <select
                  value={studentFilterYear}
                  onChange={(e) => setStudentFilterYear(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="all">All Years</option>
                  {uniqueYears.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>

                <div className="sm:ml-auto flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-semibold">
                    {selectedStudents.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="flex items-center gap-1.5 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    {getFilteredStudents().every(s => selectedStudents.includes(s.name)) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Student list */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[45vh] overflow-y-auto">
                {getFilteredStudents().length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-sm italic">No students match this filter.</div>
                ) : (
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="w-10 px-4 py-3"></th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Roll No</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Year</th>
                        <th className="px-4 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Branch</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {getFilteredStudents().map(student => (
                        <tr
                          key={student.id}
                          onClick={() => toggleStudent(student.name)}
                          className={`cursor-pointer transition-colors ${selectedStudents.includes(student.name) ? 'bg-teal-50/60' : 'hover:bg-slate-50'}`}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={selectedStudents.includes(student.name)}
                              onChange={() => toggleStudent(student.name)}
                              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 h-4 w-4"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">{student.name}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 font-mono">{student.rollNo}</td>
                          <td className="px-4 py-3 text-sm text-slate-600">{student.year || '—'}</td>
                          <td className="px-4 py-3">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">{student.branch || '—'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </Modal>
        )}

        {/* ════════════════════════════════════════════════
            MODAL: Add Experiment
        ════════════════════════════════════════════════ */}
        {showExperimentModal && experimentLab && (
          <Modal
            title={`Add Experiment — ${experimentLab.name}`}
            onClose={() => { setShowExperimentModal(false); setExperimentLab(null); }}
            footer={
              <>
                <button type="button" onClick={() => { setShowExperimentModal(false); setExperimentLab(null); }} className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto">Cancel</button>
                <button type="button" onClick={saveExperiment} disabled={isSubmitting || !experimentForm.title} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto disabled:opacity-60 gap-2">
                  <Save className="w-4 h-4" />{isSubmitting ? 'Saving...' : 'Add Experiment'}
                </button>
              </>
            }
          >
            <div className="space-y-5">
              <input
                type="text"
                placeholder="Experiment Title"
                value={experimentForm.title}
                onChange={(e) => setExperimentForm({ ...experimentForm, title: e.target.value })}
                className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
              <textarea
                placeholder="Experiment Description"
                value={experimentForm.description}
                onChange={(e) => setExperimentForm({ ...experimentForm, description: e.target.value })}
                className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                rows="3"
              />

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Test Cases</label>
                  <button type="button" onClick={addTestCase} className="text-teal-600 hover:text-teal-700 text-sm font-medium">+ Add Test Case</button>
                </div>
                <div className="space-y-3">
                  {experimentForm.testCases.map((tc, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <input
                        type="text" placeholder="Input" value={tc.input}
                        onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                        className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      />
                      <input
                        type="text" placeholder="Expected Output" value={tc.expectedOutput}
                        onChange={(e) => updateTestCase(i, 'expectedOutput', e.target.value)}
                        className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      />
                      {experimentForm.testCases.length > 1 && (
                        <button type="button" onClick={() => removeTestCase(i)} className="text-red-400 hover:text-red-600 p-1"><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default LabManagement;
