import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, FlaskConical, Search, Save, X, Beaker } from 'lucide-react';
import {
  fetchAdminFaculty,
  fetchAdminStudents,
  fetchAdminLabs,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
} from '@/services/adminService';

const Modal = ({ title, children, onSubmit, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-3xl shadow-xl max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
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
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const LabManagement = () => {
  const [labs, setLabs] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [labForm, setLabForm] = useState({
    name: '', language: '', faculty: '', students: [], experiments: []
  });
  const [experimentForm, setExperimentForm] = useState({
    title: '', description: '', testCases: [{ input: '', expectedOutput: '' }]
  });

  const resetForms = () => {
    setLabForm({ name: '', language: '', faculty: '', students: [], experiments: [] });
    setExperimentForm({ title: '', description: '', testCases: [{ input: '', expectedOutput: '' }] });
  };

  const loadData = async () => {
    try {
      const [labsResult, facultyResult, studentsResult] = await Promise.all([
        fetchAdminLabs(),
        fetchAdminFaculty(),
        fetchAdminStudents(),
      ]);

      setLabs(labsResult?.data?.labs || []);
      setFaculty(facultyResult?.data?.faculty || []);
      setStudents(studentsResult?.data?.students || []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load admin data from backend';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setLabForm({
        ...item,
        students: Array.isArray(item.students) ? item.students : [],
        experiments: Array.isArray(item.experiments) ? item.experiments : [],
      });
    } else {
      resetForms();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForms();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingItem) {
        const result = await updateAdminLab(editingItem.id, labForm);
        const updatedLab = result?.data?.lab;
        if (updatedLab) {
          setLabs((prev) => prev.map((lab) => (lab.id === updatedLab.id ? updatedLab : lab)));
        }
      } else {
        const result = await createAdminLab(labForm);
        const createdLab = result?.data?.lab;
        if (createdLab) {
          setLabs((prev) => [createdLab, ...prev]);
        }
      }
      closeModal();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save lab';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteAdminLab(id);
      setLabs((prev) => prev.filter((lab) => lab.id !== id));
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete lab';
      alert(message);
    }
  };

  const addTestCase = () => {
    setExperimentForm({
      ...experimentForm,
      testCases: [...experimentForm.testCases, { input: '', expectedOutput: '' }]
    });
  };

  const updateTestCase = (index, field, value) => {
    const updatedTestCases = [...experimentForm.testCases];
    updatedTestCases[index][field] = value;
    setExperimentForm({ ...experimentForm, testCases: updatedTestCases });
  };

  const removeTestCase = (index) => {
    const updatedTestCases = experimentForm.testCases.filter((_, i) => i !== index);
    setExperimentForm({ ...experimentForm, testCases: updatedTestCases });
  };

  const addExperimentToLab = () => {
    const newExperiment = { ...experimentForm, id: Date.now() };
    setLabForm({
      ...labForm,
      experiments: [...labForm.experiments, newExperiment]
    });
    setExperimentForm({ title: '', description: '', testCases: [{ input: '', expectedOutput: '' }] });
  };

  const filterData = () => {
    if (!searchTerm) return labs;
    return labs.filter(item =>
      ['name', 'language', 'faculty'].some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredLabs = filterData();

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">

        {/* Hero Header */}
        <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">Lab Management</h1>
              <p className="text-xs text-teal-100">Create and manage programming labs and experiments</p>
            </div>
          </div>
          <button
            onClick={() => openModal()}
            className="relative z-10 bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Create Lab
          </button>
          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* Search */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-bold text-slate-700">Find Labs</p>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {filteredLabs.length} result{filteredLabs.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, language, or faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* Lab Cards */}
        <div className="grid gap-6">
          {isLoading && (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-slate-400 text-sm text-center shadow-sm">
              Loading labs...
            </div>
          )}

          {!isLoading && filteredLabs.map((lab) => (
            <div key={lab.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">{lab.name}</h3>
                    <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                      {lab.language}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">Faculty: {lab.faculty}</p>
                </div>
                <div className="flex space-x-2 self-end lg:self-start">
                  <button
                    onClick={() => openModal(lab)}
                    className="text-blue-400 hover:text-blue-600 transition-colors p-2 bg-blue-50 rounded-lg hover:bg-blue-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteItem(lab.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-2 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center text-sm">
                    <Users className="w-4 h-4 mr-2" />
                    Assigned Students ({lab.students?.length || 0})
                  </h4>
                  <div className="max-h-24 overflow-y-auto">
                    {(lab.students || []).map((student, index) => (
                      <span key={`${lab.id}-${index}`} className="inline-block bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium mr-2 mb-2">
                        {student}
                      </span>
                    ))}
                    {(!lab.students || lab.students.length === 0) && (
                      <p className="text-xs text-slate-400 italic">No students assigned</p>
                    )}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-semibold text-slate-700 mb-3 flex items-center text-sm">
                    <FlaskConical className="w-4 h-4 mr-2" />
                    Experiments ({lab.experiments?.length || 0})
                  </h4>
                  <div className="max-h-24 overflow-y-auto space-y-2">
                    {(lab.experiments || []).map((exp, index) => (
                      <div key={`${lab.id}-exp-${index}`} className="bg-white border border-slate-200 rounded-lg p-2">
                        <div className="font-medium text-slate-800 text-xs">{exp.title}</div>
                        <div className="text-[10px] text-slate-400">{Array.isArray(exp.testCases) ? exp.testCases.length : 0} test cases</div>
                      </div>
                    ))}
                    {(!lab.experiments || lab.experiments.length === 0) && (
                      <p className="text-xs text-slate-400 italic">No experiments</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {!isLoading && filteredLabs.length === 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
              <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No labs found matching your search.</p>
            </div>
          )}
        </div>

        {showModal && (
          <Modal title={editingItem ? 'Edit Lab' : 'Create Lab'} onSubmit={handleSubmit} onClose={closeModal} isSubmitting={isSubmitting}>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Lab Name"
                  value={labForm.name}
                  onChange={(e) => setLabForm({...labForm, name: e.target.value})}
                  className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                />
                <select
                  value={labForm.language}
                  onChange={(e) => setLabForm({...labForm, language: e.target.value})}
                  className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                >
                  <option value="">Select Language</option>
                  <option value="C">C Programming</option>
                  <option value="C++">C++</option>
                  <option value="Java">Java</option>
                  <option value="Python">Python</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign Faculty</label>
                <select
                  value={labForm.faculty}
                  onChange={(e) => setLabForm({...labForm, faculty: e.target.value})}
                  className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  required
                >
                  <option value="">Select Faculty</option>
                  {faculty.map(f => (
                    <option key={f.id} value={f.name}>{f.name} ({f.specialization})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign Students</label>
                <div className="border border-slate-200 rounded-xl p-4 max-h-32 overflow-y-auto bg-slate-50">
                  {students.map(student => (
                    <label key={student.id} className="flex items-center space-x-3 mb-2 cursor-pointer hover:bg-white p-2 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={labForm.students.includes(student.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setLabForm({...labForm, students: [...labForm.students, student.name]});
                          } else {
                            setLabForm({...labForm, students: labForm.students.filter(s => s !== student.name)});
                          }
                        }}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-sm text-slate-700">{student.name} ({student.rollNo})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Add Experiments</h3>

                <div className="space-y-4 mb-6">
                  <input
                    type="text"
                    placeholder="Experiment Title"
                    value={experimentForm.title}
                    onChange={(e) => setExperimentForm({...experimentForm, title: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <textarea
                    placeholder="Experiment Description"
                    value={experimentForm.description}
                    onChange={(e) => setExperimentForm({...experimentForm, description: e.target.value})}
                    className="w-full p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    rows="3"
                  />

                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-medium text-slate-700">Test Cases</label>
                      <button type="button" onClick={addTestCase} className="text-teal-600 hover:text-teal-700 text-sm font-medium">
                        + Add Test Case
                      </button>
                    </div>
                    <div className="space-y-3">
                      {experimentForm.testCases.map((testCase, index) => (
                        <div key={index} className="flex space-x-3 items-center">
                          <input
                            type="text"
                            placeholder="Input"
                            value={testCase.input}
                            onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                            className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Expected Output"
                            value={testCase.expectedOutput}
                            onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                            className="flex-1 p-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                          />
                          {experimentForm.testCases.length > 1 && (
                            <button type="button" onClick={() => removeTestCase(index)} className="text-red-400 hover:text-red-600 p-1">
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {experimentForm.title && (
                    <button
                      type="button"
                      onClick={addExperimentToLab}
                      className="w-full p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-semibold"
                    >
                      Add Experiment to Lab
                    </button>
                  )}
                </div>

                {labForm.experiments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-slate-700 mb-3 text-sm">Added Experiments</h4>
                    <div className="space-y-2">
                      {labForm.experiments.map((exp, index) => (
                        <div key={exp.id || index} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="font-medium text-slate-800 text-sm">{exp.title}</h5>
                              <p className="text-xs text-slate-500 mb-1">{exp.description}</p>
                              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                {exp.testCases.length} test case{exp.testCases.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const updatedExperiments = labForm.experiments.filter((_, i) => i !== index);
                                setLabForm({...labForm, experiments: updatedExperiments});
                              }}
                              className="text-red-400 hover:text-red-600 ml-3 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LabManagement;
