import React, { useEffect, useState } from 'react';
import { Database, Edit, Plus, Save, Search, Trash2, X, UserCheck } from 'lucide-react';
import {
  createAdminFaculty,
  deleteAdminFaculty,
  fetchAdminFaculty,
  updateAdminFaculty,
} from '@/services/adminService';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

const Modal = ({ title, children, onSubmit, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className="bg-card border border-theme rounded-2xl p-5 w-full max-w-2xl shadow-xl max-h-[85vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-heading">{title}</h2>
        <button onClick={onClose} className="text-muted hover:text-heading transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        {children}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-theme">
          <button type="button" onClick={onClose} className="px-6 py-2 text-body bg-alt border border-theme rounded-lg hover:bg-alt transition-colors w-full sm:w-auto">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-[#1a6b5c] text-white rounded-lg hover:bg-[#134d42] transition-all flex items-center justify-center shadow-sm w-full sm:w-auto disabled:opacity-60">
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
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [deletingFacultyId, setDeletingFacultyId] = useState('');
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    email: '',
    empId: '',
    department: '',
    designation: '',
  });

  const resetForm = () => {
    setFacultyForm({ name: '', email: '', empId: '', department: '', designation: '' });
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
      designation: member.designation === 'N/A' ? '' : (member.designation || ''),
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

  const requestDeleteFaculty = (member) => {
    setDeleteCandidate(member);
  };

  const confirmDeleteFaculty = async () => {
    if (!deleteCandidate) return;
    setDeletingFacultyId(deleteCandidate.id);
    try {
      await handleDeleteFaculty(deleteCandidate.id);
      setDeleteCandidate(null);
    } finally {
      setDeletingFacultyId('');
    }
  };

  const filterData = () => {
    if (!searchTerm) return faculty;
    return faculty.filter(item =>
      ['name', 'email', 'empId', 'department', 'designation', 'specialization'].some(field =>
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
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">

        {/* Hero Header */}
        <div className="relative bg-[#1a6b5c] rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
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
            className="relative z-10 bg-card text-[#134d42] px-4 py-2 rounded-xl hover:bg-[#f0f7f5] transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Faculty
          </button>
          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {/* Search */}
        <div className="mb-6 bg-card border border-theme rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-bold text-heading">Find Faculty</p>
            <span className="text-xs font-semibold text-body bg-alt px-2.5 py-1 rounded-full">
              {filteredFaculty.length} result{filteredFaculty.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, email, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-alt border border-theme rounded-xl w-full text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-card border border-theme rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-theme bg-alt/80">
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-4 text-left text-[11px] font-bold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted text-sm">Loading faculty...</td>
                  </tr>
                )}
                {!isLoading && filteredFaculty.map((member) => (
                  <tr key={member.id} className="hover:bg-alt/70 transition-colors">
                    <td className="px-6 py-4 text-heading font-medium text-sm">{member.name}</td>
                    <td className="px-6 py-4 text-body text-sm">{member.email}</td>
                    <td className="px-6 py-4 text-body font-mono text-sm">{member.empId}</td>
                    <td className="px-6 py-4">
                      <span className="bg-[#f0f7f5] text-[#134d42] px-2.5 py-1 rounded-full text-xs font-medium">
                        {member.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body text-sm">{member.designation}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEditModal(member)} className="text-blue-400 hover:text-blue-600 transition-colors p-1.5 rounded-lg hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => requestDeleteFaculty(member)}
                          disabled={deletingFacultyId === member.id}
                          className="text-red-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50"
                          aria-label="Delete faculty"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && filteredFaculty.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-muted text-sm italic">No faculty found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <Modal title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'} onSubmit={handleSubmitFaculty} onClose={closeModal} isSubmitting={isSubmitting}>
            <div className="grid md:grid-cols-2 gap-4">
              <input type="text" placeholder="Full Name" value={facultyForm.name} onChange={(e) => setFacultyForm((prev) => ({ ...prev, name: e.target.value }))} className="p-4 bg-card border border-theme rounded-lg text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all" required />
              <input type="email" placeholder="Email" value={facultyForm.email} onChange={(e) => setFacultyForm((prev) => ({ ...prev, email: e.target.value }))} className="p-4 bg-card border border-theme rounded-lg text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all" required />
              <input type="text" placeholder="Employee ID" value={facultyForm.empId} onChange={(e) => setFacultyForm((prev) => ({ ...prev, empId: e.target.value }))} className="p-4 bg-card border border-theme rounded-lg text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all md:col-span-2" required />
              <input type="text" placeholder="Designation (e.g. Asst. Professor)" value={facultyForm.designation} onChange={(e) => setFacultyForm((prev) => ({ ...prev, designation: e.target.value }))} className="p-4 bg-card border border-theme rounded-lg text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all md:col-span-2" />
            </div>
          </Modal>
        )}

        <DeleteConfirmationModal
          isOpen={Boolean(deleteCandidate)}
          title="Delete faculty"
          message="This will permanently delete the faculty account."
          itemName={deleteCandidate ? `${deleteCandidate.name} (${deleteCandidate.empId})` : ''}
          isProcessing={Boolean(deletingFacultyId)}
          onCancel={() => setDeleteCandidate(null)}
          onConfirm={confirmDeleteFaculty}
        />
      </div>
    </div>
  );
};

export default FacultyManagement;
