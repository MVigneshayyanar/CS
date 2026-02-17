import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, FlaskConical, Search, Save, X } from 'lucide-react';

const Modal = ({ title, children, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-neutral-300 bg-neutral-800 border border-neutral-600 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
);

const LabManagement = () => {
  const [labs, setLabs] = useState([
    { 
      id: 1, 
      name: 'C Programming Lab', 
      language: 'C', 
      faculty: 'Dr. Smith',
      students: ['John Doe', 'Jane Smith'],
      experiments: [
        {
          id: 1,
          title: 'Hello World Program',
          description: 'Write a basic C program to print Hello World',
          testCases: [
            { input: '', expectedOutput: 'Hello World' },
            { input: '', expectedOutput: 'Program should compile without errors' }
          ]
        }
      ]
    }
  ]);

  // Sample data for dropdowns
  const [faculty] = useState([
    { id: 1, name: 'Dr. Smith', specialization: 'Data Structures' },
    { id: 2, name: 'Prof. Johnson', specialization: 'Programming' }
  ]);
  const [students] = useState([
    { id: 1, name: 'John Doe', rollNo: 'CS001' },
    { id: 2, name: 'Jane Smith', rollNo: 'CS002' }
  ]);

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

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setLabForm(item);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setLabs(labs.map(l => l.id === editingItem.id ? { ...labForm, id: editingItem.id } : l));
    } else {
      setLabs([...labs, { ...labForm, id: Date.now() }]);
    }
    closeModal();
  };

  const deleteItem = (id) => {
    setLabs(labs.filter(l => l.id !== id));
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
    <div className="space-y-8 p-15">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Lab Management
          </h1>
          <p className="text-neutral-400 mt-2">Create and manage programming labs and experiments</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Lab
        </button>
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
        {filteredLabs.map((lab) => (
          <div key={lab.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm hover:bg-neutral-800/70 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{lab.name}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full">
                    {lab.language}
                  </span>
                  <span className="text-neutral-400">Faculty: {lab.faculty}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => openModal(lab)}
                  className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteItem(lab.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-neutral-300 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Assigned Students ({lab.students?.length || 0})
                </h4>
                <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4 max-h-32 overflow-y-auto">
                  {lab.students?.map((student, index) => (
                    <span key={index} className="inline-block bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm mr-2 mb-2">
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
                  {lab.experiments?.map((exp) => (
                    <div key={exp.id} className="bg-neutral-800/50 rounded p-2">
                      <div className="font-medium text-white text-sm">{exp.title}</div>
                      <div className="text-xs text-neutral-400">{exp.testCases?.length || 0} test cases</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Modal */}
      {showModal && (
        <Modal title={editingItem ? 'Edit Lab' : 'Create Lab'} onSubmit={handleSubmit} onClose={closeModal}>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Lab Name"
                value={labForm.name}
                onChange={(e) => setLabForm({...labForm, name: e.target.value})}
                className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                required
              />
              <select
                value={labForm.language}
                onChange={(e) => setLabForm({...labForm, language: e.target.value})}
                className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
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
              <label className="block text-sm font-medium text-neutral-300 mb-3">Assign Faculty</label>
              <select
                value={labForm.faculty}
                onChange={(e) => setLabForm({...labForm, faculty: e.target.value})}
                className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                required
              >
                <option value="">Select Faculty</option>
                {faculty.map(f => (
                  <option key={f.id} value={f.name}>{f.name} ({f.specialization})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-3">Assign Students</label>
              <div className="border border-neutral-700 rounded-lg p-4 max-h-32 overflow-y-auto bg-neutral-800">
                {students.map(student => (
                  <label key={student.id} className="flex items-center space-x-3 mb-2 cursor-pointer hover:bg-neutral-700/30 p-2 rounded">
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
                      className="rounded border-neutral-600 text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-sm text-white">{student.name} ({student.rollNo})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-neutral-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add Experiments</h3>
              
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  placeholder="Experiment Title"
                  value={experimentForm.title}
                  onChange={(e) => setExperimentForm({...experimentForm, title: e.target.value})}
                  className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
                <textarea
                  placeholder="Experiment Description"
                  value={experimentForm.description}
                  onChange={(e) => setExperimentForm({...experimentForm, description: e.target.value})}
                  className="w-full p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  rows="3"
                />
                
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-neutral-300">Test Cases</label>
                    <button
                      type="button"
                      onClick={addTestCase}
                      className="text-teal-400 hover:text-teal-300 text-sm font-medium"
                    >
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
                          className="flex-1 p-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <input
                          type="text"
                          placeholder="Expected Output"
                          value={testCase.expectedOutput}
                          onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          className="flex-1 p-3 bg-neutral-800 border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        {experimentForm.testCases.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
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
                    className="w-full p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all"
                  >
                    Add Experiment to Lab
                  </button>
                )}
              </div>

              {labForm.experiments.length > 0 && (
                <div>
                  <h4 className="font-medium text-neutral-300 mb-3">Added Experiments</h4>
                  <div className="space-y-3">
                    {labForm.experiments.map((exp, index) => (
                      <div key={exp.id} className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-medium text-white">{exp.title}</h5>
                            <p className="text-sm text-neutral-400 mb-2">{exp.description}</p>
                            <div className="text-xs text-neutral-500">
                              {exp.testCases.length} test case{exp.testCases.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedExperiments = labForm.experiments.filter((_, i) => i !== index);
                              setLabForm({...labForm, experiments: updatedExperiments});
                            }}
                            className="text-red-400 hover:text-red-300 ml-3 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          {exp.testCases.map((tc, tcIndex) => (
                            <div key={tcIndex} className="text-xs bg-neutral-900/50 p-2 rounded border border-neutral-700">
                              <span className="text-neutral-400">Input: </span>
                              <span className="font-mono text-white">{tc.input || 'No input'}</span>
                              <br />
                              <span className="text-neutral-400">Expected: </span>
                              <span className="font-mono text-white">{tc.expectedOutput}</span>
                            </div>
                          ))}
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
  );
};

export default LabManagement;
