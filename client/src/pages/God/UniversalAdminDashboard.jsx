import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Building2, Search, Save, X, MapPin, Calendar, GraduationCap, Users, Phone, Globe, Shield, Mail, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import { 
  addSuperAdmin, 
  fetchColleges, 
  updateSuperAdmin, 
  deleteCollege, 
  deleteSuperAdmin 
} from '@/services/godService';
import { useNavigate } from 'react-router-dom';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

const toFriendlyGodSetupMessage = (message) => {
  const normalized = (message || '').toLowerCase();
  if (
    normalized.includes('database setup incomplete') ||
    normalized.includes('public.colleges') ||
    normalized.includes('schema cache')
  ) {
    return 'God management tables are not set up yet. Run server/scripts/god_management_setup.sql in Supabase SQL editor, then retry.';
  }
  return message;
};

// Modal component for Super Admin add/edit
const Modal = ({ title, children, onSubmit, onClose, isSubmitting = false, scrollable = true }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className={`bg-card border border-theme rounded-2xl p-5 w-full max-w-2xl shadow-xl ${scrollable ? 'max-h-[85vh] overflow-y-auto' : ''}`}>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-heading">{title}</h2>
        <button onClick={onClose} className="text-muted hover:text-heading transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-6">
        {children}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-theme">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-body bg-alt border border-theme rounded-lg hover:bg-alt transition-colors w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center shadow-sm w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const UniversalAdminDashboard = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [superAdminPasswords, setSuperAdminPasswords] = useState({});
  const [expandedCollegeId, setExpandedCollegeId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [superAdminForm, setSuperAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    qualification: '',
    experience: '',
    specialization: '',
    joiningDate: '',
    assignedCollege: ''
  });

  const getSuperAdminsFromColleges = (nextColleges) =>
    nextColleges.flatMap((college) =>
      (college.superAdmins || []).map((admin) => ({
        ...admin,
        assignedCollege: admin.assignedCollege || college.name,
      }))
    );

  const loadDashboardData = async () => {
    try {
      const result = await fetchColleges();
      const nextColleges = result?.data?.colleges || [];
      setColleges(nextColleges);
      setSuperAdmins(getSuperAdminsFromColleges(nextColleges));
    } catch (error) {
      const message = toFriendlyGodSetupMessage(error?.response?.data?.message) || 'Failed to load colleges from backend.';
      console.error('Fetch error:', error);
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const resetSuperAdminForm = () => {
    setSuperAdminForm({
      name: '',
      email: '',
      phone: '',
      empId: '',
      qualification: '',
      experience: '',
      specialization: '',
      joiningDate: '',
      assignedCollege: ''
    });
  };

  const openSuperAdminModal = (item = null, college = null) => {
    setEditingItem(item);
    setSelectedCollege(college);
    if (item) {
      setSuperAdminForm({ ...item, assignedCollege: item.assignedCollege || college?.name || '' });
    } else {
      resetSuperAdminForm();
      if (college) {
        setSuperAdminForm(prev => ({ ...prev, assignedCollege: college.name }));
      }
    }
    setShowModal(true);
  };

  const closeSuperAdminModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setSelectedCollege(null);
    resetSuperAdminForm();
  };

  const handleSuperAdminSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateSuperAdmin(editingItem.id, superAdminForm);
        alert('Super admin updated successfully.');
      } else {
        const result = await addSuperAdmin(superAdminForm);
        const credentials = result?.data?.credentials;
        const superAdminData = result?.data?.superAdmin;

        if (credentials && superAdminData) {
          setSuperAdminPasswords(prev => ({
            ...prev,
            [superAdminData.id]: credentials.password
          }));
          setGeneratedCredentials(credentials);
        }
      }
      await loadDashboardData();
      closeSuperAdminModal();
    } catch (error) {
      const message = toFriendlyGodSetupMessage(error?.response?.data?.message) || 'Failed to process super admin request.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestDeleteCollege = (college) => {
    setDeleteDialog({
      type: 'college',
      id: college.id,
      itemName: `${college.name} (${college.code})`,
    });
  };

  const requestDeleteSuperAdmin = (admin, collegeName) => {
    setDeleteDialog({
      type: 'superadmin',
      id: admin.id,
      collegeName,
      itemName: `${admin.name} (${admin.username || admin.empId})`,
    });
  };

  const confirmDelete = async () => {
    if (!deleteDialog) return;
    setIsDeleting(true);
    try {
      if (deleteDialog.type === 'college') {
        await deleteCollege(deleteDialog.id);
      } else {
        await deleteSuperAdmin(deleteDialog.id);
      }
      await loadDashboardData();
      setDeleteDialog(null);
    } catch (error) {
      const message = toFriendlyGodSetupMessage(error?.response?.data?.message) || 'Failed to delete record.';
      alert(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudentsAcrossColleges = colleges.reduce((sum, college) => sum + (Number(college.studentCount) || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <p className="text-body text-lg">Loading institutional data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="relative bg-[#1a6b5c] rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-5">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">Institutional Dashboard</h1>
                <p className="text-xs text-teal-100">Global Administration Control Panel</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/add-college')}
              className="relative z-10 bg-card text-[#134d42] px-5 py-2.5 rounded-xl hover:bg-[#f0f7f5] transition-all flex items-center justify-center shadow-sm text-sm font-extrabold w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Register New College
            </button>
            <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-1">Colleges</p>
              <p className="text-2xl font-extrabold text-heading">{colleges.length}</p>
              <p className="text-xs text-body mt-1">Managed institutions</p>
            </div>
            <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-1">Super Admins</p>
              <p className="text-2xl font-extrabold text-heading">{superAdmins.length}</p>
              <p className="text-xs text-body mt-1">Institutional owners</p>
            </div>
            <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-muted font-bold uppercase tracking-wider mb-1">Total Students</p>
              <p className="text-2xl font-extrabold text-heading leading-none">{totalStudentsAcrossColleges}</p>
              <p className="text-xs text-body mt-1.5">Across platform network</p>
            </div>
          </div>
        </div>

        {/* Credentials Display */}
        {generatedCredentials && (
          <div className="mb-8 bg-[#f0f7f5] border border-[#c2e6de] rounded-xl p-4 text-teal-900 shadow-sm relative">
            <button onClick={() => setGeneratedCredentials(null)} className="absolute top-4 right-4 text-[#3aa892] hover:text-[#1a6b5c]">
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 font-bold mb-3">
              <Shield className="w-5 h-5 text-[#1a6b5c]" />
              Initial Access Credentials Generated
            </div>
            <div className="grid sm:grid-cols-2 gap-4 bg-white/50 p-4 rounded-lg">
              <div>
                <p className="text-[10px] text-[#1a6b5c] font-bold uppercase tracking-wide">Login Username</p>
                <div className="font-mono text-lg font-bold">{generatedCredentials.username}</div>
              </div>
              <div>
                <p className="text-[10px] text-[#1a6b5c] font-bold uppercase tracking-wide">Initial Password</p>
                <div className="font-mono text-lg font-bold">{generatedCredentials.password}</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-[#1a6b5c] italic font-medium">Please share these credentials securely with the new Institutional Admin.</p>
          </div>
        )}

        {/* Search */}
        <div className="mb-8 bg-card border border-theme rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-extrabold text-heading">Explore Network</p>
            <span className="text-xs font-bold text-body bg-alt border border-theme px-2.5 py-1 rounded-full">
              {filteredColleges.length} matches found
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, institution code, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3.5 bg-alt border border-theme rounded-xl w-full text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all font-medium"
            />
          </div>
        </div>

        {/* Colleges Network */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-heading tracking-tight">Institution Registry</h2>
            <p className="text-muted mt-1 text-sm font-medium italic">Active college profiles and administrative hierarchies</p>
          </div>

          <div className="grid gap-8">
            {filteredColleges.map((college) => (
              <div key={college.id} className="bg-card border border-theme rounded-3xl p-5 sm:p-7 lg:p-9 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#f0f7f5]/50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8 relative z-10">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                      <h3 className="text-2xl sm:text-3xl font-black text-heading break-words">{college.name}</h3>
                      <span className="bg-blue-600/10 text-blue-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-200">
                        {college.code}
                      </span>
                      <span className="bg-[#1a6b5c]/10 text-[#134d42] px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-[#c2e6de]">
                        {college.type}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-6">
                      <div className="flex items-center text-body font-bold">
                        <MapPin className="w-4 h-4 mr-2 text-[#2a8c78]" />
                        {college.location}
                      </div>
                      <div className="flex items-center text-body font-bold">
                        <Calendar className="w-4 h-4 mr-2 text-[#2a8c78]" />
                        Est. {college.established}
                      </div>
                      <div className="flex items-center text-body font-bold">
                        <Phone className="w-4 h-4 mr-2 text-[#2a8c78]" />
                        {college.phone || 'N/A'}
                      </div>
                      <div className="flex items-center text-body font-bold">
                        <Globe className="w-4 h-4 mr-2 text-[#2a8c78]" />
                        {college.website || 'N/A'}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                      {[
                        { label: 'Depts', value: college.departmentCount, color: 'emerald' },
                        { label: 'Admins', value: college.adminCount, color: 'blue' },
                        { label: 'Super', value: college.superAdmins?.length, color: 'purple' },
                        { label: 'Faculty', value: college.facultyCount, color: 'teal' },
                        { label: 'Students', value: college.studentCount, color: 'orange' }
                      ].map((stat, i) => (
                        <div key={i} className="bg-alt/80 border border-theme-light rounded-2xl px-4 py-3 text-center transition-all hover:bg-alt">
                          <p className="text-[10px] uppercase tracking-widest text-muted font-black mb-1">{stat.label}</p>
                          <p className={`text-xl font-black text-heading`}>{Number(stat.value) || 0}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex lg:flex-col space-x-3 lg:space-x-0 lg:space-y-3 self-end lg:self-start">
                    <button
                      onClick={() => navigate(`/add-college?id=${college.id}`)}
                      className="text-muted hover:text-blue-600 transition-all p-3 bg-alt border border-theme-light rounded-2xl hover:bg-blue-50 hover:border-blue-100"
                      title="Edit institutional details"
                    >
                      <Edit className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => requestDeleteCollege(college)}
                      className="text-muted hover:text-red-600 transition-all p-3 bg-alt border border-theme-light rounded-2xl hover:bg-red-50 hover:border-red-100"
                      title="Decommission college"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="bg-alt/50 border border-theme-light rounded-2xl p-5 sm:p-7 relative z-10">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-lg shadow-[#2a8c78]/20">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="font-black text-heading text-sm tracking-tight uppercase">Master Administrators</h4>
                    </div>
                    <button
                      onClick={() => openSuperAdminModal(null, college)}
                      className="bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-all flex items-center text-xs font-black shadow-lg shadow-slate-900/20 w-full sm:w-auto justify-center"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      ADD MASTER ADMIN
                    </button>
                  </div>

                  <div className="grid gap-4">
                    {college.superAdmins?.map((admin, idx) => (
                      <div key={idx} className="bg-card border border-theme-light rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-[#1a6b5c]/10 flex items-center justify-center text-[#134d42] font-black text-lg">
                            {admin.name?.charAt(0)}
                          </div>
                          <div>
                            <div className="font-black text-heading leading-none mb-1">{admin.name}</div>
                            <div className="flex items-center gap-3 text-[11px] font-bold text-muted uppercase tracking-tighter">
                              <span>Username: <span className="text-[#1a6b5c]">{admin.username || admin.empId}</span></span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full" />
                              <span>{admin.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                          <button
                            onClick={() => {
                              const pass = superAdminPasswords[admin.id] || admin.empId;
                              alert(`Master Admin Access Path:\n\nUsername: ${admin.username || admin.empId}\nInitial Password: ${pass}\nEmp ID: ${admin.empId}`);
                            }}
                            className="p-2 text-muted hover:text-[#1a6b5c] transition-colors bg-alt rounded-xl"
                            title="Reveal Login Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openSuperAdminModal(admin, college)}
                            className="p-2 text-muted hover:text-blue-600 transition-colors bg-alt rounded-xl"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => requestDeleteSuperAdmin(admin, college.name)}
                            className="p-2 text-muted hover:text-red-600 transition-colors bg-alt rounded-xl"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(!college.superAdmins || college.superAdmins.length === 0) && (
                      <div className="text-center py-6 border-2 border-dashed border-theme-light rounded-2xl">
                        <Users className="w-8 h-8 text-muted mx-auto mb-2" />
                        <p className="text-muted text-[11px] font-black uppercase tracking-widest italic">No Master Admins Registered</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty Network State */}
        {filteredColleges.length === 0 && (
          <div className="bg-card border border-theme rounded-3xl py-24 text-center shadow-sm">
            <Building2 className="w-16 h-16 text-muted mx-auto mb-6" />
            <h3 className="text-xl font-black text-heading mb-2">No Institutional Matches</h3>
            <p className="text-muted text-sm font-medium">Verify your search criteria or register a new college above.</p>
          </div>
        )}

        {/* Super Admin Modal */}
        {showModal && (
          <Modal 
            title={editingItem ? 'Update Master Administrator' : 'Assign Master Administrator'} 
            onSubmit={handleSuperAdminSubmit}
            onClose={closeSuperAdminModal}
            isSubmitting={isSubmitting}
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-black text-heading mb-4 uppercase tracking-tighter">Personal Identity</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Dr. Jane Smith' },
                    { label: 'Email Address', key: 'email', type: 'email', placeholder: 'jane@mit.edu' },
                    { label: 'Phone Number', key: 'phone', type: 'tel', placeholder: '+1 234 567 8900' },
                    { label: 'Employee ID', key: 'empId', type: 'text', placeholder: 'EMP-001' }
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[10px] font-black text-muted uppercase mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={superAdminForm[field.key]}
                        onChange={(e) => setSuperAdminForm(prev => ({...prev, [field.key]: e.target.value}))}
                        className="w-full p-4 bg-alt border border-theme rounded-2xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-black text-heading mb-4 uppercase tracking-tighter">Institutional Rank</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-muted uppercase mb-1">Target Institution</label>
                    <select
                      value={superAdminForm.assignedCollege}
                      onChange={(e) => setSuperAdminForm(prev => ({...prev, assignedCollege: e.target.value}))}
                      disabled={Boolean(selectedCollege && !editingItem)}
                      className="w-full p-4 bg-alt border border-theme rounded-2xl text-heading focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all font-bold appearance-none"
                    >
                      <option value="">Select College</option>
                      {colleges.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-muted uppercase mb-1">Qualification</label>
                    <input
                      type="text"
                      placeholder="Ph.D in AI"
                      value={superAdminForm.qualification}
                      onChange={(e) => setSuperAdminForm(prev => ({...prev, qualification: e.target.value}))}
                      className="w-full p-4 bg-alt border border-theme rounded-2xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all font-bold"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] font-black text-muted uppercase mb-1">Administrative Specialization</label>
                  <textarea
                    placeholder="Describe administrative expertise..."
                    value={superAdminForm.specialization}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, specialization: e.target.value}))}
                    className="w-full p-4 bg-alt border border-theme rounded-2xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all font-bold h-24"
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Unified Delete Confirmation */}
        <DeleteConfirmationModal
          isOpen={Boolean(deleteDialog)}
          title={deleteDialog?.type === 'college' ? 'Decommission Institution' : 'Revoke Administrator Access'}
          message={deleteDialog?.type === 'college' 
            ? 'This action will PERMANENTLY remove this institution and ALL sub-entities (departments, faculty, students) from the system. THIS CANNOT BE UNDONE.' 
            : 'This will revoke all administrative privileges for this user. This action is permanent.'}
          itemName={deleteDialog?.itemName || ''}
          isProcessing={isDeleting}
          onCancel={() => setDeleteDialog(null)}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};

export default UniversalAdminDashboard;
