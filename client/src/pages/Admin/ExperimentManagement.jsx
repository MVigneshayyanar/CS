import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2,
  Edit,
  FlaskConical, 
  ArrowLeft, 
  Save, 
  X, 
  ChevronRight,
  Database,
  Code
} from 'lucide-react';
import { fetchAdminLab, updateAdminLab } from '@/services/adminService';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

/* ───── Reusable Modal Shell ───── */
const Modal = ({ title, children, onClose, footer }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
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

const ExperimentManagement = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteExperimentIndex, setDeleteExperimentIndex] = useState(null);
  const [experimentForm, setExperimentForm] = useState({
    title: '', description: '', testCases: [{ input: '', expectedOutput: '' }]
  });

  const loadLab = async () => {
    try {
      const result = await fetchAdminLab(labId);
      setLab(result?.data?.lab || null);
    } catch (error) {
      alert('Failed to load lab details');
      navigate('/labs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLab();
  }, [labId]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAddModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [showAddModal]);

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

  const openAddModal = () => {
    setEditingIndex(null);
    setExperimentForm({ title: '', description: '', testCases: [{ input: '', expectedOutput: '' }] });
    setShowAddModal(true);
  };

  const openEditModal = (exp, index) => {
    setEditingIndex(index);
    setExperimentForm({
      title: exp.title || '',
      description: exp.description || '',
      testCases: Array.isArray(exp.testCases) ? [...exp.testCases] : [{ input: '', expectedOutput: '' }]
    });
    setShowAddModal(true);
  };

  const handleSaveExperiment = async () => {
    if (!lab || !experimentForm.title) return;
    setIsSubmitting(true);
    try {
      let updatedExperiments;
      if (editingIndex !== null) {
        // Edit mode
        updatedExperiments = [...(lab.experiments || [])];
        updatedExperiments[editingIndex] = { ...experimentForm, id: updatedExperiments[editingIndex].id || Date.now() };
      } else {
        // Add mode
        const newExp = { ...experimentForm, id: Date.now() };
        updatedExperiments = [...(lab.experiments || []), newExp];
      }

      const payload = { ...lab, experiments: updatedExperiments };
      const result = await updateAdminLab(lab.id, payload);
      const updated = result?.data?.lab;
      if (updated) setLab(updated);
      setShowAddModal(false);
      setEditingIndex(null);
      setExperimentForm({ title: '', description: '', testCases: [{ input: '', expectedOutput: '' }] });
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to save experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperiment = async (expIndex) => {
    setIsSubmitting(true);
    try {
      const updatedExperiments = (lab.experiments || []).filter((_, i) => i !== expIndex);
      const payload = { ...lab, experiments: updatedExperiments };
      const result = await updateAdminLab(lab.id, payload);
      const updated = result?.data?.lab;
      if (updated) setLab(updated);
    } catch (error) {
      alert('Failed to delete experiment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDeleteExperiment = (expIndex) => {
    setDeleteExperimentIndex(expIndex);
  };

  const confirmDeleteExperiment = async () => {
    if (deleteExperimentIndex === null) return;
    await handleDeleteExperiment(deleteExperimentIndex);
    setDeleteExperimentIndex(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          Loading experiments...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        
        {/* Teal Header Banner — matching main dashboards */}
        <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-4">
            <button 
              onClick={() => navigate('/labs')}
              className="p-2 bg-white/20 hover:bg-white/30 border border-white/20 rounded-xl text-white transition-all shadow-sm group"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">
                  {lab?.name || 'Laboratory'}
                </h1>
                <p className="text-xs text-teal-100">Experiment & Problem Management</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={openAddModal}
            className="relative z-10 bg-white text-teal-700 px-5 py-2.5 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-bold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Experiment
          </button>

          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute -right-4 -bottom-10 w-24 h-24 rounded-full bg-white/5" />
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Experiments</p>
            <p className="text-2xl font-extrabold text-slate-800">{lab?.experiments?.length || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Published problems</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Test Scale</p>
            <p className="text-2xl font-extrabold text-slate-800">
              {(lab?.experiments || []).reduce((acc, curr) => acc + (curr.testCases?.length || 0), 0)}
            </p>
            <p className="text-xs text-slate-500 mt-1">Total test cases across lab</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Language</p>
            <p className="text-2xl font-extrabold text-slate-800">{lab?.language || 'N/A'}</p>
            <p className="text-xs text-slate-500 mt-1">Primary runtime environment</p>
          </div>
        </div>

        {/* Main Content Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Code className="w-5 h-5 text-teal-600" />
            Lab Experiments
          </h2>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            {lab?.experiments?.length || 0} ITEMS
          </span>
        </div>

        {/* Experiment List */}
        <div className="grid gap-4">
          {lab?.experiments?.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center">
              <Code className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900">No experiments yet</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                Click the button above to add your first coding experiment for this laboratory.
              </p>
            </div>
          ) : (
            lab.experiments.map((exp, index) => (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                        <span className="text-teal-700 font-bold text-xs">Ex {index + 1}</span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">{exp.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{exp.description || 'No description provided.'}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        <Database className="w-3.5 h-3.5" />
                        {exp.testCases?.length || 0} Test Cases
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => openEditModal(exp, index)}
                      className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit Experiment"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => requestDeleteExperiment(index)}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Experiment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <Modal
            title={editingIndex !== null ? "Edit Experiment" : "Create New Experiment"}
            onClose={() => setShowAddModal(false)}
            footer={
              <>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto font-semibold"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveExperiment} 
                  disabled={isSubmitting || !experimentForm.title} 
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center shadow-lg shadow-teal-500/20 w-full sm:w-auto disabled:opacity-60 gap-2 font-bold"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : 'Publish Experiment'}
                </button>
              </>
            }
          >
            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Array Reversal Algorithm"
                  value={experimentForm.title}
                  onChange={(e) => setExperimentForm({ ...experimentForm, title: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 font-mono">Description</label>
                <textarea
                  placeholder="Explain the problem statement and requirements..."
                  value={experimentForm.description}
                  onChange={(e) => setExperimentForm({ ...experimentForm, description: e.target.value })}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  rows="3"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono">Input / Output Test Cases</label>
                  <button 
                    type="button" 
                    onClick={addTestCase} 
                    className="text-teal-600 hover:text-teal-700 text-xs font-bold bg-teal-50 px-3 py-1.5 rounded-lg transition-all"
                  >
                    + Add New Case
                  </button>
                </div>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {experimentForm.testCases.map((tc, i) => (
                    <div key={i} className="flex gap-3 items-center bg-white p-3 border border-slate-100 rounded-xl shadow-sm">
                      <div className="flex-1 space-y-2">
                        <textarea
                          placeholder="Standard Input"
                          value={tc.input}
                          onChange={(e) => updateTestCase(i, 'input', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-mono"
                          rows="2"
                        />
                        <textarea
                          placeholder="Expected Output"
                          value={tc.expectedOutput}
                          onChange={(e) => updateTestCase(i, 'expectedOutput', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all font-mono"
                          rows="2"
                        />
                      </div>
                      {experimentForm.testCases.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeTestCase(i)} 
                          className="text-slate-300 hover:text-red-500 p-2 bg-slate-50 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}

        <DeleteConfirmationModal
          isOpen={deleteExperimentIndex !== null}
          title="Delete experiment"
          message="This experiment will be permanently removed from this lab."
          itemName={deleteExperimentIndex !== null ? lab?.experiments?.[deleteExperimentIndex]?.title || '' : ''}
          isProcessing={isSubmitting}
          onCancel={() => setDeleteExperimentIndex(null)}
          onConfirm={confirmDeleteExperiment}
        />

      </div>
    </div>
  );
};

export default ExperimentManagement;
