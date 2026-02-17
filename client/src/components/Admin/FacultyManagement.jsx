import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Save, X } from 'lucide-react';

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

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([
    { id: 1, name: 'Dr. Smith', email: 'smith@example.com', empId: 'FAC001', department: 'CSE', specialization: 'Data Structures' },
    { id: 2, name: 'Prof. Johnson', email: 'johnson@example.com', empId: 'FAC002', department: 'CSE', specialization: 'Programming' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyForm, setFacultyForm] = useState({
    name: '', email: '', empId: '', department: '', specialization: ''
  });

  const resetForm = () => {
    setFacultyForm({ name: '', email: '', empId: '', department: '', specialization: '' });
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFacultyForm(item);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    resetForm();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setFaculty(faculty.map(f => f.id === editingItem.id ? { ...facultyForm, id: editingItem.id } : f));
    } else {
      setFaculty([...faculty, { ...facultyForm, id: Date.now() }]);
    }
    closeModal();
  };

  const deleteItem = (id) => {
    setFaculty(faculty.filter(f => f.id !== id));
  };

  const filterData = () => {
    if (!searchTerm) return faculty;
    return faculty.filter(item =>
      ['name', 'email', 'empId', 'department'].some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredFaculty = filterData();

  return (
    <div className="space-y-8 p-15">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Faculty Management
          </h1>
          <p className="text-neutral-400 mt-2">Manage faculty members and their specializations</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Faculty
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg w-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
        />
      </div>
      
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-800/80">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {filteredFaculty.map((member) => (
                <tr key={member.id} className="hover:bg-neutral-700/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{member.name}</td>
                  <td className="px-6 py-4 text-neutral-300">{member.email}</td>
                  <td className="px-6 py-4 text-neutral-300 font-mono">{member.empId}</td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-600/20 text-teal-300 px-2 py-1 rounded text-sm">
                      {member.department}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-300">{member.specialization}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openModal(member)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(member.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Faculty Modal */}
      {showModal && (
        <Modal title={editingItem ? 'Edit Faculty' : 'Add Faculty'} onSubmit={handleSubmit} onClose={closeModal}>
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              value={facultyForm.name}
              onChange={(e) => setFacultyForm({...facultyForm, name: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={facultyForm.email}
              onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <input
              type="text"
              placeholder="Employee ID"
              value={facultyForm.empId}
              onChange={(e) => setFacultyForm({...facultyForm, empId: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <select
              value={facultyForm.department}
              onChange={(e) => setFacultyForm({...facultyForm, department: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            >
              <option value="">Select Department</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
            </select>
            <input
              type="text"
              placeholder="Specialization"
              value={facultyForm.specialization}
              onChange={(e) => setFacultyForm({...facultyForm, specialization: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all md:col-span-2"
              required
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FacultyManagement;
