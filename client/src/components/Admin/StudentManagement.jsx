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

const StudentManagement = () => {
  const [students, setStudents] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', rollNo: 'CS001', year: '2nd', branch: 'CSE' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', rollNo: 'CS002', year: '2nd', branch: 'CSE' }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentForm, setStudentForm] = useState({
    name: '', email: '', rollNo: '', year: '', branch: ''
  });

  const resetForm = () => {
    setStudentForm({ name: '', email: '', rollNo: '', year: '', branch: '' });
  };

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setStudentForm(item);
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
      setStudents(students.map(s => s.id === editingItem.id ? { ...studentForm, id: editingItem.id } : s));
    } else {
      setStudents([...students, { ...studentForm, id: Date.now() }]);
    }
    closeModal();
  };

  const deleteItem = (id) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const filterData = () => {
    if (!searchTerm) return students;
    return students.filter(item =>
      ['name', 'email', 'rollNo', 'branch'].some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredStudents = filterData();

  return (
    <div className="space-y-8 p-15">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-neutral-400 mt-2">Manage student records and information</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Student
        </button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search students..."
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Roll No</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-neutral-700/30 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-neutral-300">{student.email}</td>
                  <td className="px-6 py-4 text-neutral-300 font-mono">{student.rollNo}</td>
                  <td className="px-6 py-4 text-neutral-300">{student.year}</td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-600/20 text-teal-300 px-2 py-1 rounded text-sm">
                      {student.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => openModal(student)}
                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteItem(student.id)}
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

      {/* Student Modal */}
      {showModal && (
        <Modal title={editingItem ? 'Edit Student' : 'Add Student'} onSubmit={handleSubmit} onClose={closeModal}>
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="Full Name"
              value={studentForm.name}
              onChange={(e) => setStudentForm({...studentForm, name: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={studentForm.email}
              onChange={(e) => setStudentForm({...studentForm, email: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <input
              type="text"
              placeholder="Roll Number"
              value={studentForm.rollNo}
              onChange={(e) => setStudentForm({...studentForm, rollNo: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            />
            <select
              value={studentForm.year}
              onChange={(e) => setStudentForm({...studentForm, year: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
              required
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            <select
              value={studentForm.branch}
              onChange={(e) => setStudentForm({...studentForm, branch: e.target.value})}
              className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all md:col-span-2"
              required
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science Engineering</option>
              <option value="IT">Information Technology</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="EEE">Electrical & Electronics</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentManagement;
