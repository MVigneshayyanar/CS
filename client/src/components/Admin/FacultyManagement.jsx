import React, { useEffect, useState } from 'react';
import { Database, Edit, Plus, Save, Search, Trash2, X, UserCheck } from 'lucide-react';
import {
  createAdminFaculty,
  deleteAdminFaculty,
  fetchAdminFaculty,
  updateAdminFaculty,
} from '@/services/adminService';

const Modal = ({ title, children, onSubmit, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200">
          <button type="button" onClick={onClose} className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto disabled:opacity-60">
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
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">

        {/* Hero Header */}
        <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">Faculty Management</h1>
              <p className="text-xs text-teal-100">Add and manage faculty from backend database</p>
            </div>
          </div>
          <button
            onClick={openCreateModal}
            className="relative z-10 bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Faculty
          </button>
          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* Search */}
        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-bold text-slate-700">Find Faculty</p>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {filteredFaculty.length} result{filteredFaculty.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-sm">Loading faculty...</td>
                  </tr>
                )}
                {!isLoading && filteredFaculty.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 text-slate-800 font-medium text-sm">{member.name}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{member.email}</td>
                    <td className="px-6 py-4 text-slate-600 font-mono text-sm">{member.empId}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">
                        {member.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{member.specialization}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditModal(member)} className="text-blue-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteFaculty(member.id)} className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filteredFaculty.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 text-sm italic">No faculty found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <Modal title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'} onSubmit={handleSubmitFaculty} onClose={closeModal} isSubmitting={isSubmitting}>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={facultyForm.name} onChange={(e) => setFacultyForm((prev) => ({ ...prev, name: e.target.value }))} className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" required />
              <input type="email" placeholder="Email" value={facultyForm.email} onChange={(e) => setFacultyForm((prev) => ({ ...prev, email: e.target.value }))} className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all" required />
              <input type="text" placeholder="Employee ID" value={facultyForm.empId} onChange={(e) => setFacultyForm((prev) => ({ ...prev, empId: e.target.value }))} className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all md:col-span-2" required />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default FacultyManagement;
