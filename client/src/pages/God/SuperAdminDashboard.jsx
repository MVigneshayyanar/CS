import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UserCog, Search, Save, X, Mail, User, Building2, GraduationCap, Shield, Phone } from 'lucide-react';
import {
  fetchSuperAdminCollege,
  createDepartmentHead,
  updateDepartmentHead,
  deleteDepartmentHead,
} from '@/services/superAdminService';

// Move Modal component OUTSIDE to prevent recreation on every render
const Modal = ({ title, children, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
            className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
);

const SuperAdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [college, setCollege] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    department: '',
    qualification: '',
    experience: '',
    specialization: '',
    joiningDate: '',
    permissions: []
  });

  const availablePermissions = [
    'manage_students',
    'manage_faculty',
    'manage_labs',
    'view_reports',
    'conduct_exams',
    'manage_curriculum',
    'approve_leaves',
    'generate_certificates'
  ];

  const resetForm = () => {
    setAdminForm({
      name: '',
      email: '',
      phone: '',
      empId: '',
      department: '',
      qualification: '',
      experience: '',
      specialization: '',
      joiningDate: '',
      permissions: []
    });
    setNewDepartmentName('');
  };

  const addDepartmentOption = () => {
    const name = newDepartmentName.trim();
    if (!name) {
      return;
    }

    const alreadyExists = departments.some(
      (dept) => dept.name.toLowerCase() === name.toLowerCase()
    );

    if (alreadyExists) {
      alert('Department already exists. Please select it from the list.');
      return;
    }

    const nextDepartment = {
      id: Date.now(),
      name,
      code: name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
      totalStudents: 0,
      totalFaculty: 0,
    };

    setDepartments((prev) => [...prev, nextDepartment]);
    setAdminForm((prev) => ({ ...prev, department: name }));
    setNewDepartmentName('');
  };

  const mapDepartments = (departmentNames) =>
    (departmentNames || []).map((name, index) => ({
      id: `dept-${index}-${name}`,
      name,
      code: name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .toUpperCase(),
      totalStudents: 0,
      totalFaculty: 0,
    }));

  const loadCollegeData = async () => {
    try {
      const result = await fetchSuperAdminCollege();
      const collegeData = result?.data?.college;

      if (!collegeData) {
        throw new Error('No college data in response');
      }

      setCollege(collegeData);
      setAdmins(collegeData.departmentHeads || []);

      const incomingDepartments = mapDepartments(collegeData.departments || []);
      if (incomingDepartments.length) {
        setDepartments(incomingDepartments);
      }
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to load college data from backend';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollegeData();
  }, []);

  const openModal = (item = null) => {
    setEditingItem(item);
    if (item) {
      setAdminForm(item);
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        const result = await updateDepartmentHead(editingItem.id, adminForm);
        const updated = result?.data?.departmentHead;
        if (updated) {
          setAdmins((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }
      } else {
        const result = await createDepartmentHead(adminForm);
        const created = result?.data?.departmentHead;
        const credentials = result?.data?.credentials;

        if (created) {
          setAdmins((prev) => [...prev, { ...created, password: credentials?.password || created.empId }]);
        }

        const createdDepartment = adminForm.department?.trim();
        if (createdDepartment) {
          const exists = departments.some((dept) => dept.name.toLowerCase() === createdDepartment.toLowerCase());
          if (!exists) {
            setDepartments((prev) => [
              ...prev,
              {
                id: `dept-local-${Date.now()}`,
                name: createdDepartment,
                code: createdDepartment
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase(),
                totalStudents: 0,
                totalFaculty: 0,
              },
            ]);
          }
        }
      }

      closeModal();
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to save department head';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showDepartmentHeadCredentials = (admin) => {
    const username = admin.username || admin.empId;
    const password = admin.password || admin.empId;
    alert(`Username: ${username}\nPassword: ${password}\nEmployee ID: ${admin.empId}`);
  };

  const deleteAdmin = async (id) => {
    try {
      await deleteDepartmentHead(id);
      setAdmins((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to delete department head';
      alert(message);
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const keyword = searchTerm.toLowerCase();
    return (
      (admin.name || '').toLowerCase().includes(keyword) ||
      (admin.email || '').toLowerCase().includes(keyword) ||
      (admin.department || '').toLowerCase().includes(keyword) ||
      (admin.empId || '').toLowerCase().includes(keyword)
    );
  });

  const getPermissionLabel = (permission) => {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-neutral-400 text-lg">Loading college data...</p>
          </div>
        ) : !college ? (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-neutral-400 text-lg">No college data found. Please login as a Super Admin.</p>
          </div>
        ) : (
          <>
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                <Shield className="w-8 h-8 mr-4 text-teal-400" />
                Super Admin Dashboard
              </h1>
              <p className="text-neutral-400 mt-2 text-lg">Manage college administration and department heads</p>
              <div className="flex items-center space-x-2 mt-3">
                <Building2 className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-500">{college.name}</span>
              </div>
              <div className="flex items-center space-x-6 mt-4 text-sm text-neutral-500">
                <span className="flex items-center">
                  <UserCog className="w-4 h-4 mr-1" />
                  {admins.length} Department Heads
                </span>
                <span className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-1" />
                  {college.code}
                </span>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-8 py-4 rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg hover:shadow-teal-500/25"
            >
              <Plus className="w-5 h-5 mr-2" />
              Assign Department Head
            </button>
          </div>
        </div>

        {/* Department Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Department Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">{dept.name}</h3>
                  <span className="bg-teal-600/20 text-teal-300 px-2 py-1 rounded text-sm font-mono">
                    {dept.code}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-neutral-400">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="text-blue-400 font-medium">{dept.totalStudents}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Faculty:</span>
                    <span className="text-green-400 font-medium">{dept.totalFaculty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Head:</span>
                    <span className="text-white font-medium">
                      {admins.find(admin => admin.department === dept.name)?.name.split(' ')[1] || 'Not Assigned'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 w-5 h-5" />
          <input
            type="text"
            placeholder="Search department heads by name, email, department, or employee ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 bg-neutral-800/50 border border-neutral-700 rounded-xl w-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all backdrop-blur-sm"
          />
        </div>

        {/* Department Heads List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Department Heads</h2>
         
          {filteredAdmins.map((admin) => (
            <div key={admin.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 backdrop-blur-sm hover:bg-neutral-800/70 transition-all hover:border-teal-500/50">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3
                      className="text-xl font-bold text-white flex items-center cursor-pointer"
                      onClick={() => showDepartmentHeadCredentials(admin)}
                      title="Click to view username and password"
                    >
                      <UserCog className="w-5 h-5 mr-2 text-teal-400" />
                      {admin.name}
                    </h3>
                    <span className="bg-teal-600/20 text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                      {admin.role}
                    </span>
                  </div>
                 
                  <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center text-neutral-400">
                      <Mail className="w-4 h-4 mr-2" />
                      {admin.email}
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <Phone className="w-4 h-4 mr-2" />
                      {admin.phone}
                    </div>
                    <div className="flex items-center text-neutral-400">
                      <User className="w-4 h-4 mr-2" />
                      {admin.empId}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Department: </span>
                      <span className="text-white font-medium">{admin.department}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Experience: </span>
                      <span className="text-white font-medium">{admin.experience}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Qualification: </span>
                      <span className="text-white font-medium">{admin.qualification}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500">Joining Date: </span>
                      <span className="text-white font-medium">{new Date(admin.joiningDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
               
                <div className="flex space-x-3">
                  <button
                    onClick={() => showDepartmentHeadCredentials(admin)}
                    className="text-green-400 hover:text-green-300 transition-colors p-2 bg-green-600/10 rounded-lg hover:bg-green-600/20"
                    title="View Username and Password"
                  >
                    <User className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openModal(admin)}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-2 bg-blue-600/10 rounded-lg hover:bg-blue-600/20"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteAdmin(admin.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2 bg-red-600/10 rounded-lg hover:bg-red-600/20"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg p-4">
                <div className="mb-4">
                  <h4 className="font-semibold text-neutral-300 mb-2">Specialization</h4>
                  <p className="text-neutral-400 text-sm">{admin.specialization}</p>
                </div>
               
                <div>
                  <h4 className="font-semibold text-neutral-300 mb-3">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {admin.permissions?.map((permission, index) => (
                      <span key={index} className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full text-sm">
                        {getPermissionLabel(permission)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-16">
            <UserCog className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 text-lg">No department heads found matching your search.</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <Modal 
            title={editingItem ? 'Edit Department Head' : 'Assign Department Head'} 
            onSubmit={handleSubmit}
            onClose={closeModal}
          >
            <div className="space-y-6">
              {isSubmitting && (
                <div className="text-sm text-teal-300">Saving department head to database...</div>
              )}
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name (e.g., Dr. Priya Nair)"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({...adminForm, name: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({...adminForm, email: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Employee ID (e.g., MIT-CSE-001)"
                    value={adminForm.empId}
                    onChange={(e) => setAdminForm({...adminForm, empId: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new department (e.g., Biotechnology)"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="flex-1 p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addDepartmentOption}
                      className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg"
                    >
                      Add Department
                    </button>
                  </div>
                  <select
                    value={adminForm.department}
                    onChange={(e) => setAdminForm({...adminForm, department: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Qualification (e.g., Ph.D in Computer Science)"
                    value={adminForm.qualification}
                    onChange={(e) => setAdminForm({...adminForm, qualification: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Experience (e.g., 15 years)"
                    value={adminForm.experience}
                    onChange={(e) => setAdminForm({...adminForm, experience: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                  <input
                    type="date"
                    placeholder="Joining Date"
                    value={adminForm.joiningDate}
                    onChange={(e) => setAdminForm({...adminForm, joiningDate: e.target.value})}
                    className="p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    required
                  />
                </div>
                <textarea
                  placeholder="Specialization (e.g., Artificial Intelligence & Machine Learning)"
                  value={adminForm.specialization}
                  onChange={(e) => setAdminForm({...adminForm, specialization: e.target.value})}
                  className="mt-4 p-4 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all w-full h-20"
                  required
                />
              </div>

              {/* Permissions */}
              
            </div>
          </Modal>
        )}
          </>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
