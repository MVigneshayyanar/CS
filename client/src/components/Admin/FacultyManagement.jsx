import React, { useEffect, useState } from 'react';
import { Database, Edit, Plus, Save, Search, Trash2, X } from 'lucide-react';
import {
  createAdminFaculty,
  deleteAdminFaculty,
  fetchAdminFaculty,
  updateAdminFaculty,
} from '@/services/adminService';

const Modal = ({ title, children, onSubmit, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-3xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-700">
          <button type="button" onClick={onClose} className="px-6 py-2 text-neutral-300 bg-neutral-800 border border-neutral-600 rounded-lg hover:bg-neutral-700 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg disabled:opacity-60">
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  </div>
);

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    empId: '',
    department: '',
    specialization: '',
  });

  const resetForm = () => {
    setFacultyForm({ name: '', email: '', empId: '', department: '', specialization: '' });
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
    resetForm();
  };

  const openCreateModal = () => {
    setEditingFaculty(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (member) => {
    setEditingFaculty(member);
    setFacultyForm({
      name: member.name || '',
      email: member.email || '',
      empId: member.empId || '',
      department: member.department === 'N/A' ? '' : (member.department || ''),
      specialization: member.specialization === 'N/A' ? '' : (member.specialization || ''),
    });
    setShowModal(true);
  };

  const handleSubmitFaculty = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingFaculty) {
        const result = await updateAdminFaculty(editingFaculty.id, facultyForm);
        const updatedFaculty = result?.data?.faculty;
        if (updatedFaculty) {
          setFaculty((prev) => prev.map((item) => (item.id === updatedFaculty.id ? updatedFaculty : item)));
        }
      } else {
        const result = await createAdminFaculty(facultyForm);
        const createdFaculty = result?.data?.faculty;
        if (createdFaculty) {
          setFaculty((prev) => [createdFaculty, ...prev]);
          alert(`Faculty created. Username: ${createdFaculty.credentials?.username || createdFaculty.empId}, Password: ${createdFaculty.credentials?.password || createdFaculty.empId}`);
        }
      }
      closeModal();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save faculty';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFaculty = async (facultyId) => {
    try {
      await deleteAdminFaculty(facultyId);
      setFaculty((prev) => prev.filter((item) => item.id !== facultyId));
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete faculty';
      alert(message);
    }
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

  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const result = await fetchAdminFaculty();
        setFaculty(result?.data?.faculty || []);
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to fetch faculty from backend';
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFaculty();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Faculty Management
          </h1>
          <p className="text-neutral-400 mt-2">Add and view faculty from backend database</p>
        </div>
        <div className="flex items-center gap-3">
          {/* <div className="text-xs text-neutral-400 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 flex items-center gap-2"> */}
            {/* <Database className="w-4 h-4" /> */}
            {/* Backend Synced */}
          {/* </div> */}
          <button onClick={openCreateModal} className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Faculty
          </button>
        </div>
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
              {isLoading && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-neutral-400">Loading faculty...</td>
                </tr>
              )}
              {!isLoading && filteredFaculty.map((member) => (
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
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(member)} className="p-1 text-blue-400 hover:text-blue-300">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteFaculty(member.id)} className="p-1 text-red-400 hover:text-red-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isLoading && filteredFaculty.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center text-neutral-500">No faculty found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'} onSubmit={handleSubmitFaculty} onClose={closeModal} isSubmitting={isSubmitting}>
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" value={facultyForm.name} onChange={(e) => setFacultyForm((prev) => ({ ...prev, name: e.target.value }))} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white" required />
            <input type="email" placeholder="Email" value={facultyForm.email} onChange={(e) => setFacultyForm((prev) => ({ ...prev, email: e.target.value }))} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white" required />
            <input type="text" placeholder="Employee ID" value={facultyForm.empId} onChange={(e) => setFacultyForm((prev) => ({ ...prev, empId: e.target.value }))} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white" required />
            <input type="text" placeholder="Department (optional)" value={facultyForm.department} onChange={(e) => setFacultyForm((prev) => ({ ...prev, department: e.target.value }))} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white" />
            <input type="text" placeholder="Specialization (optional)" value={facultyForm.specialization} onChange={(e) => setFacultyForm((prev) => ({ ...prev, specialization: e.target.value }))} className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white md:col-span-2" />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default FacultyManagement;
