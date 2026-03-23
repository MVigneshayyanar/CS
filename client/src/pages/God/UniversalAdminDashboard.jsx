import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Building2, Search, Save, X, MapPin, Calendar, GraduationCap, Users, Phone, Globe, Shield, Mail, User, UserPlus } from 'lucide-react';
import { addCollege, addSuperAdmin, fetchColleges } from '@/services/godService';

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
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto p-4 sm:p-6">
    <div className={`bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-4xl shadow-2xl ${scrollable ? 'max-h-[90vh] overflow-y-auto' : ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors p-1">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-6">
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
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6 flex items-center justify-center">
        <p className="text-neutral-400 text-lg">Loading college data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center">
            <Building2 className="w-8 h-8 mr-4 text-blue-400" />
            Universal Admin Dashboard
          </h1>
          <p className="text-neutral-400 mt-2 text-lg">Manage educational institutions and super administrators</p>
          <div className="flex items-center space-x-6 mt-4 text-sm text-neutral-500">
            <span className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              {colleges.length} Colleges
            </span>
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              {superAdmins.length} Super Admins
            </span>
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {colleges.reduce((sum, college) => sum + college.totalStudents, 0)} Total Students
            </span>
          </div>
        </div>

        {/* Search */}
        {generatedCredentials && (
          <div className="mb-8 bg-emerald-600/10 border border-emerald-500/40 rounded-xl p-4 text-emerald-200">
            <div className="font-semibold mb-2">Super Admin created successfully</div>
            <div className="text-sm">Username: <span className="font-mono">{generatedCredentials.username}</span></div>
            <div className="text-sm">Password: <span className="font-mono">{generatedCredentials.password}</span></div>
            <button
              type="button"
              onClick={() => setGeneratedCredentials(null)}
              className="mt-3 text-xs text-emerald-300 hover:text-emerald-100"
            >
              Hide credentials
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl w-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all backdrop-blur-sm"
          />
        </div>

        {/* Colleges Section */}
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Colleges</h2>
              <p className="text-neutral-400 mt-2">Manage educational institutions and their administrators</p>
            </div>
            <button
              onClick={() => openModal('college')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center shadow-lg hover:shadow-blue-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New College
            </button>
          </div>

          <div className="grid gap-8">
            {filteredColleges.map((college) => (
              <div key={college.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-8 backdrop-blur-sm hover:bg-neutral-800/70 transition-all hover:border-blue-500/50">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-2xl font-bold text-white">{college.name}</h3>
                      <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                        {college.code}
                      </span>
                      <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                        {college.type}
                      </span>
                    </div>
                   
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center text-neutral-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {college.location}
                      </div>
                      <div className="flex items-center text-neutral-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        Established {college.established}
                      </div>
                      <div className="flex items-center text-neutral-400">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Affiliated to {college.affiliation}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm mb-6">
                      <div className="flex items-center text-neutral-400">
                        <Phone className="w-4 h-4 mr-2" />
                        {college.phone}
                      </div>
                      <div className="text-neutral-400">{college.email}</div>
                      <div className="flex items-center text-neutral-400">
                        <Globe className="w-4 h-4 mr-2" />
                        {college.website}
                      </div>
                    </div>
                  </div>
                 
                  <div className="flex space-x-3">
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

                <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-6">
                  <div className="grid md:grid-cols-1 gap-6">
                    <div>
                      <button
                        onClick={() => setExpandedCollegeId(expandedCollegeId === college.id ? null : college.id)}
                        className="w-full flex justify-between items-center mb-3 p-3 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <div className="flex items-center">
                          <h4 className="font-semibold text-neutral-300 flex items-center">
                            <Shield className="w-4 h-4 mr-2" />
                            Super Admins ({college.superAdmins?.length || 0})
                          </h4>
                        </div>
                        <span className="text-neutral-400">
                          {expandedCollegeId === college.id ? '▼' : '▶'}
                        </span>
                      </button>

                      {expandedCollegeId === college.id && (
                        <>
                          <div className="mb-3 flex justify-end">
                            <button
                              onClick={() => openModal('superadmin', null, college)}
                              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-3 py-1.5 rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center text-sm shadow-md"
                            >
                              <UserPlus className="w-4 h-4 mr-1" />
                              Add Super Admin
                            </button>
                          </div>
                          <div className="space-y-2">
                            {college.superAdmins?.map((admin, index) => (
                              <div key={index} className="bg-teal-600/20 text-teal-300 px-3 py-2 rounded-lg text-sm flex justify-between items-center">
                                <div>
                                  <div className="font-medium">{admin.name}</div>
                                  <div className="text-xs text-teal-400">Username: {admin.username || admin.empId}</div>
                                  <div className="text-xs text-teal-400">{admin.email}</div>
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
                              <div className="text-neutral-500 text-sm italic">No super admins assigned</div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-neutral-500 border-t border-neutral-700 pt-4">
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
            <Building2 className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No colleges found matching your search.</p>
          </div>
        )}

        {/* College Modal */}
        {showModal && modalType === 'college' && (
          <Modal 
            title={editingItem ? 'Edit College' : 'Add New College'} 
            onSubmit={handleCollegeSubmit}
            onClose={closeModal}
            isSubmitting={isSubmitting}
            scrollable={false}
          >
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="College Name"
                    value={collegeForm.name}
                    onChange={(e) => setCollegeForm(prev => ({...prev, name: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="College Code (e.g., MIT)"
                    value={collegeForm.code}
                    onChange={(e) => setCollegeForm(prev => ({...prev, code: e.target.value.toUpperCase()}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Location (City, State)"
                    value={collegeForm.location}
                    onChange={(e) => setCollegeForm(prev => ({...prev, location: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Established Year"
                    value={collegeForm.established}
                    onChange={(e) => setCollegeForm(prev => ({...prev, established: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <select
                    value={collegeForm.type}
                    onChange={(e) => setCollegeForm(prev => ({...prev, type: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select College Type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="Autonomous">Autonomous</option>
                    <option value="Deemed">Deemed University</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Affiliation (e.g., VTU, Anna University)"
                    value={collegeForm.affiliation}
                    onChange={(e) => setCollegeForm(prev => ({...prev, affiliation: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <textarea
                  placeholder="Full Address"
                  value={collegeForm.address}
                  onChange={(e) => setCollegeForm(prev => ({...prev, address: e.target.value}))}
                  className="mt-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full h-20"
                />
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={collegeForm.phone}
                    onChange={(e) => setCollegeForm(prev => ({...prev, phone: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={collegeForm.email}
                    onChange={(e) => setCollegeForm(prev => ({...prev, email: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    value={collegeForm.website}
                    onChange={(e) => setCollegeForm(prev => ({...prev, website: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Statistics</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Total Students"
                    value={collegeForm.totalStudents}
                    onChange={(e) => setCollegeForm(prev => ({...prev, totalStudents: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name (e.g., Dr. Rajesh Kumar)"
                    value={superAdminForm.name}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, name: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={superAdminForm.email}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, email: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={superAdminForm.phone}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, phone: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Employee ID (e.g., MIT-SA-001)"
                    value={superAdminForm.empId}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, empId: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={superAdminForm.assignedCollege}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, assignedCollege: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
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
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Experience (e.g., 15 years)"
                    value={superAdminForm.experience}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, experience: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                  <input
                    type="date"
                    placeholder="Joining Date"
                    value={superAdminForm.joiningDate}
                    onChange={(e) => setSuperAdminForm(prev => ({...prev, joiningDate: e.target.value}))}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  />
                </div>
                <textarea
                  placeholder="Specialization (e.g., Educational Administration & Technology)"
                  value={superAdminForm.specialization}
                  onChange={(e) => setSuperAdminForm(prev => ({...prev, specialization: e.target.value}))}
                  className="mt-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all w-full h-20"
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
