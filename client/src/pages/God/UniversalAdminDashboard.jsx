import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Building2, Search, Save, X, MapPin, Calendar, GraduationCap, Users, Phone, Globe, Shield, Mail, User, UserPlus } from 'lucide-react';
import { addCollege, addSuperAdmin, fetchColleges } from '@/services/godService';
import { useNavigate } from 'react-router-dom';

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

// Move Modal component OUTSIDE to prevent recreation on every render
const Modal = ({ title, children, onSubmit, onClose, isSubmitting = false, scrollable = true }) => (
  <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className={`bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-2xl shadow-xl ${scrollable ? 'max-h-[85vh] overflow-y-auto' : ''}`}>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{title}</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-6">
        {children}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors w-full sm:w-auto"
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
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [collegeForm, setCollegeForm] = useState({
    name: '',
    code: '',
    location: '',
    address: '',
    established: '',
    type: '',
    affiliation: '',
    phone: '',
    email: '',
    website: '',
    departments: [],
    totalStudents: '',
    totalFaculty: ''
  });

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
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const resetForms = () => {
    setCollegeForm({
      name: '',
      code: '',
      location: '',
      address: '',
      established: '',
      type: '',
      affiliation: '',
      phone: '',
      email: '',
      website: ''
    });
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

  const openModal = (type, item = null, college = null) => {
    setModalType(type);
    setEditingItem(item);
    setSelectedCollege(college);
   
    if (item) {
      if (type === 'college') {
        setCollegeForm({ ...item });
      } else if (type === 'superadmin') {
        setSuperAdminForm({...item});
      }
    } else {
      resetForms();
      if (type === 'superadmin' && college) {
        setSuperAdminForm(prev => ({...prev, assignedCollege: college.name}));
      }
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setModalType('');
    setSelectedCollege(null);
    resetForms();
  };

  const handleCollegeSubmit = async () => {
    if (editingItem) {
      const updatedColleges = colleges.map(c =>
        c.id === editingItem.id
          ? {
              ...editingItem,
              ...collegeForm,
            }
          : c
      );
      setColleges(updatedColleges);
      setSuperAdmins(getSuperAdminsFromColleges(updatedColleges));
      closeModal();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addCollege(collegeForm);
      const createdCollege = result?.data?.college;

      if (createdCollege) {
        const updatedColleges = [...colleges, createdCollege];
        setColleges(updatedColleges);
        setSuperAdmins(getSuperAdminsFromColleges(updatedColleges));
      }

      closeModal();
    } catch (error) {
      const message = toFriendlyGodSetupMessage(error?.response?.data?.message) || 'Failed to create college.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuperAdminSubmit = async () => {
    if (editingItem) {
      const updatedSuperAdmins = superAdmins.map(sa =>
        sa.id === editingItem.id ? { ...sa, ...superAdminForm } : sa
      );
      setSuperAdmins(updatedSuperAdmins);

      const updatedColleges = colleges.map(college => {
        if (college.name !== superAdminForm.assignedCollege) {
          return {
            ...college,
            superAdmins: (college.superAdmins || []).filter(sa => sa.id !== editingItem.id),
          };
        }

        const existingAdmins = (college.superAdmins || []).filter(sa => sa.id !== editingItem.id);
        return {
          ...college,
          superAdmins: [...existingAdmins, { ...editingItem, ...superAdminForm }],
        };
      });

      setColleges(updatedColleges);
      closeModal();
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addSuperAdmin(superAdminForm);
      const credentials = result?.data?.credentials || null;
      const superAdminData = result?.data?.superAdmin || null;

      if (credentials && superAdminData) {
        // Store password for later retrieval
        setSuperAdminPasswords(prev => ({
          ...prev,
          [superAdminData.id]: credentials.password
        }));
      }

      setGeneratedCredentials(credentials);
      await loadDashboardData();
      closeModal();
    } catch (error) {
      const message = toFriendlyGodSetupMessage(error?.response?.data?.message) || 'Failed to create super admin.';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteCollege = (id) => {
    const college = colleges.find(c => c.id === id);
    if (college) {
      setSuperAdmins(prev => prev.filter(sa => sa.assignedCollege !== college.name));
    }
    setColleges(prev => prev.filter(c => c.id !== id));
  };

  const deleteSuperAdmin = (adminId, collegeName) => {
    setSuperAdmins(prev => prev.filter(sa => sa.id !== adminId));
    setColleges(prev => prev.map(college => ({
      ...college,
      superAdmins: college.superAdmins?.filter(sa => sa.id !== adminId) || []
    })));
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudentsAcrossColleges = colleges.reduce((sum, college) => sum + (Number(college.studentCount) || 0), 0);

  const availableDepartments = [
    'Computer Science Engineering',
    'Information Technology',
    'Electronics & Communication Engineering',
    'Electrical & Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Aerospace Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Artificial Intelligence & Machine Learning'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading college data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        {/* Header */}
        <div className="mb-8">
          <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-5">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">
                  God Dashboard
                </h1>
                <p className="text-xs text-teal-100">Manage colleges and super admins</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/add-college')}
              className="relative z-10 bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New College
            </button>
            <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Colleges</p>
              <p className="text-2xl font-extrabold text-slate-800">{colleges.length}</p>
              <p className="text-xs text-slate-500 mt-1">Registered institutions</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Super Admins</p>
              <p className="text-2xl font-extrabold text-slate-800">{superAdmins.length}</p>
              <p className="text-xs text-slate-500 mt-1">Active college-level owners</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Students</p>
              <p className="text-2xl font-extrabold text-slate-800">{totalStudentsAcrossColleges}</p>
              <p className="text-xs text-slate-500 mt-1">Total across all colleges</p>
            </div>
          </div>
        </div>

        {/* Search */}
        {generatedCredentials && (
          <div className="mb-8 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900">
            <div className="font-semibold mb-2">Super Admin created successfully</div>
            <div className="text-sm">Username: <span className="font-mono">{generatedCredentials.username}</span></div>
            <div className="text-sm">Password: <span className="font-mono">{generatedCredentials.password}</span></div>
            <button
              type="button"
              onClick={() => setGeneratedCredentials(null)}
              className="mt-3 text-xs text-emerald-700 hover:text-emerald-900"
            >
              Hide credentials
            </button>
          </div>
        )}

        {/* Search */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-3">
            <p className="text-sm font-bold text-slate-700">Find Colleges</p>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
              {filteredColleges.length} result{filteredColleges.length === 1 ? '' : 's'}
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, code, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        {/* Colleges Section */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">Colleges</h2>
              <p className="text-slate-400 mt-1 text-sm">Manage educational institutions and their administrators</p>
            </div>
            {/* <button
              type="button"
              onClick={() => navigate('/add-college')}
              className="bg-teal-600 text-white px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-all flex items-center shadow-sm text-sm font-semibold"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add New College
            </button> */}
          </div>

          <div className="grid gap-8">
            {filteredColleges.map((college) => (
              <div key={college.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{college.name}</h3>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {college.code}
                      </span>
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                        {college.type}
                      </span>
                    </div>
                   
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center text-slate-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {college.location}
                      </div>
                      <div className="flex items-center text-slate-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Established {college.established}
                      </div>
                      <div className="flex items-center text-slate-500">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Affiliated to {college.affiliation}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-6">
                      <div className="flex items-center text-slate-500">
                        <Phone className="w-4 h-4 mr-2" />
                        {college.phone}
                      </div>
                      <div className="text-slate-500 break-all">{college.email}</div>
                      <div className="flex items-center text-slate-500">
                        <Globe className="w-4 h-4 mr-2" />
                        {college.website}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Departments</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{Number(college.departmentCount) || 0}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Admins</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{Number(college.adminCount) || 0}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Super Admins</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{college.superAdmins?.length || 0}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Faculty</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{Number(college.facultyCount) || 0}</p>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Students</p>
                        <p className="text-xl font-bold text-slate-800 mt-1">{Number(college.studentCount) || 0}</p>
                      </div>
                    </div>
                  </div>
                 
                  <div className="flex space-x-3 self-end lg:self-start">
                    <button
                      onClick={() => openModal('college', college)}
                      className="text-blue-400 hover:text-blue-300 transition-colors p-2 bg-blue-600/10 rounded-lg hover:bg-blue-600/20"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteCollege(college.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-600/10 rounded-lg hover:bg-red-600/20"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <div className="grid md:grid-cols-1 gap-6">
                    <div>
                      <button
                        onClick={() => setExpandedCollegeId(expandedCollegeId === college.id ? null : college.id)}
                        className="w-full flex justify-between items-center mb-3 p-3 bg-white hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                      >
                        <div className="flex items-center">
                          <h4 className="font-semibold text-slate-700 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Super Admins ({college.superAdmins?.length || 0})
                          </h4>
                        </div>
                        <span className="text-slate-400">
                          {expandedCollegeId === college.id ? '▼' : '▶'}
                        </span>
                      </button>

                      {expandedCollegeId === college.id && (
                        <>
                          <div className="mb-3 flex justify-end">
                            <button
                              onClick={() => openModal('superadmin', null, college)}
                              className="bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-700 transition-all flex items-center text-sm shadow-sm w-full sm:w-auto justify-center"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add Super Admin
                            </button>
                          </div>
                          <div className="space-y-2">
                            {college.superAdmins?.map((admin, index) => (
                              <div key={index} className="bg-teal-50 text-teal-900 px-3 py-2 rounded-lg text-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border border-teal-100">
                                <div>
                                  <div className="font-medium">{admin.name}</div>
                                  <div className="text-xs text-teal-700">Username: {admin.username || admin.empId}</div>
                                  <div className="text-xs text-teal-700">{admin.email}</div>
                                </div>
                                <div className="flex space-x-1">
                                  <button
                                    onClick={() => {
                                      const password = superAdminPasswords[admin.id] || admin.empId;
                                      alert(`Username: ${admin.username || admin.empId}\nPassword: ${password}\nEmployee ID: ${admin.empId}`);
                                    }}
                                    className="text-green-400 hover:text-green-300 transition-colors p-1"
                                    title="View credentials"
                                  >
                                    👁
                                  </button>
                                  <button
                                    onClick={() => openModal('superadmin', admin)}
                                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => deleteSuperAdmin(admin.id, college.name)}
                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            {(!college.superAdmins || college.superAdmins.length === 0) && (
                              <div className="text-slate-500 text-sm italic">No super admins assigned</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 border-t border-slate-200 pt-4">
                    Address: {college.address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredColleges.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">No colleges found matching your search.</p>
          </div>
        )}

        {/* College Modal */}
        {showModal && modalType === 'college' && (
          <Modal 
            title={editingItem ? 'Edit College' : 'Add New College'} 
            onSubmit={handleCollegeSubmit}
            onClose={closeModal}
            isSubmitting={isSubmitting}
            scrollable
          >
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="College Name"
                    value={collegeForm.name}
                    onChange={(e) => setCollegeForm(prev => ({...prev, name: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="College Code (e.g., MIT)"
                    value={collegeForm.code}
                    onChange={(e) => setCollegeForm(prev => ({...prev, code: e.target.value.toUpperCase()}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Location (City, State)"
                    value={collegeForm.location}
                    onChange={(e) => setCollegeForm(prev => ({...prev, location: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Established Year"
                    value={collegeForm.established}
                    onChange={(e) => setCollegeForm(prev => ({...prev, established: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <select
                    value={collegeForm.type}
                    onChange={(e) =>
                      setCollegeForm((prev) => ({
                        ...prev,
                        type: e.target.value,
                        affiliation: e.target.value === 'Deemed' ? '' : prev.affiliation,
                      }))
                    }
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select College Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Autonomous">Autonomous</option>
                    <option value="Deemed">Deemed University</option>
                  </select>
                  {collegeForm.type !== 'Deemed' && (
                    <input
                      type="text"
                      placeholder="Affiliation (e.g., VTU, Anna University)"
                      value={collegeForm.affiliation}
                      onChange={(e) => setCollegeForm(prev => ({...prev, affiliation: e.target.value}))}
                      className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  )}
                </div>
                <textarea
                  placeholder="Full Address"
                  value={collegeForm.address}
                  onChange={(e) => setCollegeForm(prev => ({...prev, address: e.target.value}))}
                  className="mt-4 p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full h-20"
                />
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={collegeForm.phone}
                    onChange={(e) => setCollegeForm(prev => ({...prev, phone: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={collegeForm.email}
                    onChange={(e) => setCollegeForm(prev => ({...prev, email: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    value={collegeForm.website}
                    onChange={(e) => setCollegeForm(prev => ({...prev, website: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Statistics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Total Students"
                    value={collegeForm.totalStudents}
                    onChange={(e) => setCollegeForm(prev => ({...prev, totalStudents: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </Modal>
        )}

        {/* Super Admin Modal */}
        {showModal && modalType === 'superadmin' && (
          <Modal 
            title={editingItem ? 'Edit Super Admin' : 'Assign Super Admin'} 
            onSubmit={handleSuperAdminSubmit}
            onClose={closeModal}
            isSubmitting={isSubmitting}
          >
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name (e.g., Dr. Rajesh Kumar)"
                    value={superAdminForm.name}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, name: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={superAdminForm.email}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, email: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={superAdminForm.phone}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, phone: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Employee ID (e.g., MIT-SA-001)"
                    value={superAdminForm.empId}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, empId: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={superAdminForm.assignedCollege}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, assignedCollege: e.target.value}))}
                    disabled={Boolean(selectedCollege && !editingItem)}
                    className={`p-4 bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all ${
                      selectedCollege && !editingItem ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Select College</option>
                    {colleges.map(college => (
                      <option key={college.id} value={college.name}>{college.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Qualification (e.g., Ph.D in Computer Science)"
                    value={superAdminForm.qualification}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, qualification: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Experience (e.g., 15 years)"
                    value={superAdminForm.experience}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, experience: e.target.value}))}
                    className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <textarea
                  placeholder="Specialization (e.g., Educational Administration & Technology)"
                  value={superAdminForm.specialization}
                  onChange={(e) => setSuperAdminForm(prev => ({...prev, specialization: e.target.value}))}
                  className="mt-4 p-4 bg-white border border-slate-200 rounded-lg text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all w-full h-20"
                />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default UniversalAdminDashboard;
