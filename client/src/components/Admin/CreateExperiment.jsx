import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminLabs, updateAdminLab } from '@/services/adminService';
import { ArrowLeft, Plus, FlaskConical, Play, Trash2 } from 'lucide-react';

const CreateExperiment = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [experimentForm, setExperimentForm] = useState({
    title: '', description: '', testCases: [{ input: '', expectedOutput: '' }]
  });

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const { data } = await fetchAdminLabs();
        const foundLab = (data?.labs || []).find(l => String(l.id) === String(labId));
        if (foundLab) {
          setLab({
            ...foundLab,
            experiments: Array.isArray(foundLab.experiments) ? foundLab.experiments : []
          });
        }
      } catch (err) {
        console.error("Failed to load lab", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLab();
  }, [labId]);

  const handleAddTestCase = () => {
    setExperimentForm({
      ...experimentForm,
      testCases: [...experimentForm.testCases, { input: '', expectedOutput: '' }]
    });
  };

  const handleUpdateTestCase = (index, field, value) => {
    const updatedTestCases = [...experimentForm.testCases];
    updatedTestCases[index][field] = value;
    setExperimentForm({ ...experimentForm, testCases: updatedTestCases });
  };

  const handleRemoveTestCase = (index) => {
    const updatedTestCases = experimentForm.testCases.filter((_, i) => i !== index);
    setExperimentForm({ ...experimentForm, testCases: updatedTestCases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!experimentForm.title || !experimentForm.description || !lab) return;

    setIsSubmitting(true);
    const newExperiment = { ...experimentForm, id: Date.now() };
    const updatedExperiments = [...lab.experiments, newExperiment];

    try {
      await updateAdminLab(lab.id, { ...lab, experiments: updatedExperiments });
      navigate(`/labs/${labId}`);
    } catch (err) {
      alert("Failed to add experiment to lab");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-neutral-400">Loading lab...</div>;
  if (!lab) return <div className="p-8 text-red-400">Lab not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate(`/labs/${labId}`)} className="mr-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent flex items-center">
            <FlaskConical className="w-8 h-8 mr-3 text-teal-400" />
            Add New Experiment
          </h1>
          <p className="text-neutral-400 mt-2">Create an experiment and test cases for <span className="text-white font-medium">{lab.name}</span></p>
        </div>
      </div>

      <div className="bg-[#1e1e24] border border-neutral-700/60 rounded-2xl p-6 md:p-8 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Experiment Title</label>
            <input
              type="text"
              placeholder="E.g., Linked List Implementation"
              value={experimentForm.title}
              onChange={(e) => setExperimentForm({...experimentForm, title: e.target.value})}
              className="w-full p-4 bg-black/40 border border-neutral-700/80 rounded-xl text-white placeholder-neutral-600 focus:ring-2 focus:ring-teal-500/50 transition-all outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-300 mb-2">Description / Problem Statement</label>
            <textarea
              placeholder="Describe the problem statement..."
              value={experimentForm.description}
              onChange={(e) => setExperimentForm({...experimentForm, description: e.target.value})}
              className="w-full p-4 bg-black/40 border border-neutral-700/80 rounded-xl text-white placeholder-neutral-600 focus:ring-2 focus:ring-teal-500/50 transition-all outline-none"
              rows="6"
              required
            />
          </div>

          <div className="bg-black/30 p-6 rounded-xl border border-neutral-800">
            <div className="flex justify-between items-center mb-6 border-b border-neutral-800 pb-4">
              <label className="text-base font-semibold text-neutral-300">Test Cases</label>
              <button type="button" onClick={handleAddTestCase} className="text-sm px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 rounded-lg transition-all flex items-center">
                <Plus className="w-4 h-4 mr-1" /> Add Test Case
              </button>
            </div>
            
            <div className="space-y-4">
              {experimentForm.testCases.map((testCase, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-neutral-900/40 p-4 rounded-xl border border-neutral-800">
                  <span className="text-xs text-neutral-500 font-mono hidden sm:inline-block w-8 text-center bg-black/50 p-2 rounded">#{index+1}</span>
                  <div className="flex-1 w-full relative">
                     <span className="absolute top-0 right-0 -mt-2.5 mr-2 bg-black text-neutral-600 text-[10px] px-1 font-mono uppercase">Input</span>
                     <textarea
                      placeholder="Input data"
                      value={testCase.input}
                      onChange={(e) => handleUpdateTestCase(index, 'input', e.target.value)}
                      className="w-full p-3 bg-black/60 border border-neutral-700/50 rounded-lg text-sm text-white focus:border-teal-500/50 outline-none resize-y"
                      rows="3"
                     />
                  </div>
                  <div className="flex-1 w-full relative">
                     <span className="absolute top-0 right-0 -mt-2.5 mr-2 bg-black text-neutral-600 text-[10px] px-1 font-mono uppercase">Expected Output</span>
                     <textarea
                      placeholder="Output data"
                      value={testCase.expectedOutput}
                      onChange={(e) => handleUpdateTestCase(index, 'expectedOutput', e.target.value)}
                      className="w-full p-3 bg-black/60 border border-neutral-700/50 rounded-lg text-sm text-white focus:border-teal-500/50 outline-none resize-y"
                      rows="3"
                     />
                  </div>
                  {experimentForm.testCases.length > 1 && (
                    <button type="button" onClick={() => handleRemoveTestCase(index)} className="text-red-400/80 hover:text-red-400 hover:bg-red-400/10 p-3 rounded-xl transition-all self-end sm:self-auto">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-neutral-800">
            <button
              type="submit"
              disabled={isSubmitting || !experimentForm.title || !experimentForm.description}
              className="px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-medium rounded-xl hover:scale-[1.02] transition-all flex items-center shadow-lg shadow-teal-900/40 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Play className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Adding...' : 'Add Experiment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExperiment;
