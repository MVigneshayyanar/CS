import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Users, FlaskConical, Search, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  fetchAdminLabs,
  deleteAdminLab,
} from '@/services/adminService';

const LabManagement = () => {
  const navigate = useNavigate();
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      const labsResult = await fetchAdminLabs();
      setLabs(labsResult?.data?.labs || []);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load labs';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteItem = async (e, id) => {
    e.stopPropagation();
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
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Lab Management
          </h1>
          <p className="text-neutral-400 mt-2">Create and manage programming labs and experiments (backend synced)</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <div className="text-xs text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 flex items-center gap-2"> */}
            {/* <Database className="w-4 h-4" /> */}
            {/* Backend Synced */}
          {/* </div> */}
          <button
            onClick={() => navigate('/labs/create')}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Lab
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search labs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg w-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
        />
      </div>

      <div className="grid gap-6">
        {isLoading && (
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 text-neutral-400">
            Loading labs...
          </div>
        )}

        {!isLoading && filteredLabs.map((lab) => (
          <div 
            key={lab.id} 
            onClick={() => navigate('/labs/' + lab.id)}
            className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm hover:bg-neutral-800/80 transition-all cursor-pointer group hover:border-teal-500/30"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-400 transition-colors">{lab.name}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full">
                    {lab.language}
                  </span>
                  <span className="text-neutral-400">Faculty: {lab.faculty || 'Unassigned'}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={(e) => deleteItem(e, lab.id)}
                  className="bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all p-2 rounded-lg opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="bg-neutral-700/50 p-2 rounded-lg text-neutral-400 group-hover:text-white transition-colors group-hover:bg-teal-500/20 group-hover:text-teal-400">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 opacity-80 group-hover:opacity-100 transition-opacity">
              <div>
                <h4 className="font-semibold text-neutral-300 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Assigned Students ({lab.students?.length || 0})
                </h4>
                <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {(lab.students || []).map((student, index) => (
                    <span key={`${lab.id}-${index}`} className="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm mr-2 mb-2">
                      {student}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-300 mb-3 flex items-center">
                  <FlaskConical className="w-4 h-4 mr-2" />
                  Experiments ({lab.experiments?.length || 0})
                </h4>
                <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4 max-h-32 overflow-y-auto space-y-2">
                  {(lab.experiments || []).map((exp, index) => (
                    <div key={`${lab.id}-exp-${index}`} className="bg-neutral-800/50 rounded p-2">
                      <div className="font-medium text-white text-sm">{exp.title}</div>
                      <div className="text-xs text-neutral-400">{Array.isArray(exp.testCases) ? exp.testCases.length : 0} test cases</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && filteredLabs.length === 0 && (
          <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8 text-center text-neutral-500">
            No labs found.
          </div>
        )}
      </div>
    </div>
  );
};

export default LabManagement;
