import React, { useEffect, useState } from 'react';
import { Database, Edit, Plus, Save, Search, Trash2, X } from 'lucide-react';
import {
  createAdminStudent,
  deleteAdminStudent,
  fetchAdminStudents,
  updateAdminStudent,
} from '@/services/adminService';

const Modal = ({ title, children, onSubmit, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-6 py-2 text-slate-700 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-slate-900 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg disabled:opacity-60">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save'}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    rollNo: '',
    year: '',
    branch: '',
  });

  const resetForm = () => {
    setStudentForm({ name: '', email: '', rollNo: '', year: '', branch: '' });
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
      name: student.name || '',
      email: student.email || '',
      rollNo: student.rollNo || '',
      year: student.year === 'N/A' ? '' : (student.year || ''),
      branch: student.branch === 'N/A' ? '' : (student.branch || ''),
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
          setStudents((prev) => prev.map((item) => (item.id === updatedStudent.id ? updatedStudent : item)));
        }
      } else {
        const result = await createAdminStudent(studentForm);
        const createdStudent = result?.data?.student;
        if (createdStudent) {
          setStudents((prev) => [createdStudent, ...prev]);
          alert(`Student created. Username: ${createdStudent.credentials?.username || createdStudent.rollNo}, Password: ${createdStudent.credentials?.password || createdStudent.rollNo}`);
        }
      }
      closeModal();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save student';
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
      const message = error?.response?.data?.message || 'Failed to delete student';
      alert(message);
    }
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

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const result = await fetchAdminStudents();
        setStudents(result?.data?.students || []);
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to fetch students from backend';
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Student Management
          </h1>
          <p className="text-slate-500 mt-2">Add and view students from backend database</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2"> */}
            {/* <Database className="w-4 h-4" /> */}
            {/* Backend Synced */}
          {/* </div> */}
          <button onClick={openCreateModal} className="bg-gradient-to-r from-teal-600 to-cyan-600 text-slate-900 px-4 py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>
      
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search students..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg w-full text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
        />
      </div>
      
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Branch</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-slate-500">Loading students...</td>
                </tr>
              )}
              {!isLoading && filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-900 font-medium">{student.name}</td>
                  <td className="px-6 py-4 text-slate-700">{student.email}</td>
                  <td className="px-6 py-4 text-slate-700 font-mono">{student.rollNo}</td>
                  <td className="px-6 py-4 text-slate-700">{student.year}</td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-600/20 text-teal-300 px-2 py-1 rounded text-sm">
                      {student.branch}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(student)} className="p-1 text-blue-400 hover:text-blue-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-slate-400">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editingStudent ? 'Edit Student' : 'Add Student'} onSubmit={handleSubmitStudent} onClose={closeModal} isSubmitting={isSubmitting}>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={studentForm.name} onChange={(e) => setStudentForm((prev) => ({ ...prev, name: e.target.value }))} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900" required />
            <input type="email" placeholder="Email" value={studentForm.email} onChange={(e) => setStudentForm((prev) => ({ ...prev, email: e.target.value }))} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900" required />
            <input type="text" placeholder="ID" value={studentForm.rollNo} onChange={(e) => setStudentForm((prev) => ({ ...prev, rollNo: e.target.value }))} className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 md:col-span-2" required />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StudentManagement;
