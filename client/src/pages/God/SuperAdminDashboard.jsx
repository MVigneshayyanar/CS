import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, UserCog, Search, Save, X, Mail, User, Shield, Phone, ChevronDown } from 'lucide-react';
import {
  fetchSuperAdminCollege,
  createDepartmentHead,
  updateDepartmentHead,
  deleteDepartmentHead,
} from '@/services/superAdminService';

const Modal = ({ title, children, onSubmit, onClose }) => (
  <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white border border-slate-200 rounded-2xl p-5 w-full max-w-3xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="space-y-4">
        {children}
        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm text-slate-600 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-5 py-2 text-sm bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-md"
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [college, setCollege] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDepartmentMenuOpen, setIsDepartmentMenuOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const departmentMenuRef = useRef(null);

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
      totalStaff: 0,
    };

    setDepartments((prev) => [...prev, nextDepartment]);
    setAdminForm((prev) => ({ ...prev, department: name }));
    setNewDepartmentName('');
  };

  const mapDepartments = (departmentNames, departmentHeads = [], departmentWiseCounts = []) => {
    const countByDepartment = new Map(
      (departmentWiseCounts || []).map((item) => [
        (item.department || '').toLowerCase().trim(),
        item,
      ])
    );

    return (departmentNames || []).map((name, index) => {
      const staffInDept = departmentHeads.filter(
        (head) => (head.department || '').toLowerCase() === name.toLowerCase()
      );

      const stats = countByDepartment.get((name || '').toLowerCase().trim()) || {};

      return {
        id: `dept-${index}-${name}`,
        name,
        code: name
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase(),
        totalStaff: staffInDept.length,
        studentCount: Number(stats.studentCount) || 0,
        facultyCount: Number(stats.facultyCount) || 0,
        adminCount: Number(stats.adminCount) || staffInDept.length,
      };
    });
  };

  const loadCollegeData = async () => {
    try {
      const result = await fetchSuperAdminCollege();
      const collegeData = result?.data?.college;

      if (!collegeData) {
        throw new Error('No college data in response');
      }

      setCollege(collegeData);
      const heads = collegeData.departmentHeads || [];
      setAdmins(heads);

      const mergedDepartmentNames = [
        ...(collegeData.departments || []),
        ...((collegeData.departmentWiseCounts || []).map((item) => item.department).filter(Boolean)),
      ];

      const uniqueDepartmentNames = [...new Set(mergedDepartmentNames.map((name) => name.trim()))].filter(Boolean);
      const incomingDepartments = mapDepartments(
        uniqueDepartmentNames,
        heads,
        collegeData.departmentWiseCounts || []
      );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (departmentMenuRef.current && !departmentMenuRef.current.contains(event.target)) {
        setIsDepartmentMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
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
    setIsDepartmentMenuOpen(false);
    resetForm();
  };

  const validateAdminForm = () => {
    const requiredFields = [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'empId', label: 'Employee ID' },
      { key: 'department', label: 'Department' },
      { key: 'qualification', label: 'Qualification' },
      { key: 'experience', label: 'Experience' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'joiningDate', label: 'Joining Date' },
    ];

    const missingFields = requiredFields
      .filter(({ key }) => {
        const value = adminForm[key];
        return typeof value === 'string' ? !value.trim() : !value;
      })
      .map(({ label }) => label);

    if (missingFields.length > 0) {
      alert(`Please fill all mandatory fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateAdminForm()) {
      return;
    }

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
                totalStaff: 1,
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

  const deleteAdmin = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    try {
      await deleteDepartmentHead(deleteTarget.id);
      setAdmins((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
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
    return permission.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const totalStudents = Number(college?.studentCount) || 0;
  const totalFaculty = Number(college?.facultyCount) || 0;
  const totalAdmins = Number(college?.adminCount) || admins.length;

  return (
      <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="mb-8">
          <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col md:flex-row md:items-center justify-between overflow-hidden gap-3 mb-5">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">Super Admin Dashboard</h1>
                <p className="text-xs text-teal-100">Manage departments and department heads</p>
              </div>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              {/* <button
                type="button"
                onClick={() => navigate('/assign-department-head')}
                className="bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Assign Department Head
              </button> */}
              {/* <button
                type="button"
                onClick={handleLogout}
                className="bg-teal-700 text-white px-4 py-2 rounded-xl hover:bg-teal-800 transition-all border border-teal-500 text-sm font-semibold"
              >
                Logout
              </button> */}
            </div>

            <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Students</p>
              <p className="text-2xl font-extrabold text-slate-800">{totalStudents}</p>
              <p className="text-xs text-slate-500 mt-1">Across all departments</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Faculty</p>
              <p className="text-2xl font-extrabold text-slate-800">{totalFaculty}</p>
              <p className="text-xs text-slate-500 mt-1">Across all departments</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Admins</p>
              <p className="text-2xl font-extrabold text-slate-800">{totalAdmins}</p>
              <p className="text-xs text-slate-500 mt-1">Department-level admins</p>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="text-sm text-slate-600 outline-none bg-transparent w-full placeholder:text-slate-400"
              placeholder="Search by name, email, department or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-400 py-20 justify-center">
            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            Loading college data...
          </div>
        ) : !college ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-500">
            No college data found. Please login as a Super Admin.
          </div>
        ) : (
          <div className="space-y-4">

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900">Department Heads</h2>

              {filteredAdmins.map((admin) => (
                <div key={admin.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-teal-200 transition-all">
                  <div className="flex justify-between items-start mb-4 gap-5">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3
                          className="text-xl font-bold text-slate-900 flex items-center cursor-pointer"
                          onClick={() => showDepartmentHeadCredentials(admin)}
                          title="Click to view username and password"
                        >
                          <UserCog className="w-5 h-5 mr-2 text-teal-600" />
                          {admin.name}
                        </h3>
                        <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-semibold border border-teal-100">
                          {admin.role}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-3 gap-2 text-sm mb-4 text-slate-500">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-slate-400" />
                          {admin.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-slate-400" />
                          {admin.phone}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-slate-400" />
                          {admin.empId}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-x-8 gap-y-0.5 text-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Department</span>
                          <span className="text-slate-800 font-semibold text-right">{admin.department}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Experience</span>
                          <span className="text-slate-800 font-semibold text-right">{admin.experience}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Qualification</span>
                          <span className="text-slate-800 font-semibold text-right">{admin.qualification}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Joining Date</span>
                          <span className="text-slate-800 font-semibold text-right">{new Date(admin.joiningDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => showDepartmentHeadCredentials(admin)}
                        className="text-teal-600 hover:text-teal-700 transition-colors p-2.5 bg-teal-50 rounded-xl hover:bg-teal-100"
                        title="View Username and Password"
                      >
                        <User className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal(admin)}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-2.5 bg-blue-50 rounded-xl hover:bg-blue-100"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: admin.id, name: admin.name || 'this department head' })}
                        className="text-red-600 hover:text-red-700 transition-colors p-2.5 bg-red-50 rounded-xl hover:bg-red-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-slate-700 mb-2">Specialization</h4>
                      <p className="text-slate-600 text-sm">{admin.specialization}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2">Permissions</h4>
                      <div className="flex flex-wrap gap-2">
                        {admin.permissions?.map((permission, index) => (
                          <span key={index} className="bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-100">
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
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm text-center py-16">
                <UserCog className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 text-lg">No department heads found matching your search.</p>
              </div>
            )}

            {showModal && (
              <Modal
                title="Edit Department Head"
                onSubmit={handleSubmit}
                onClose={closeModal}
              >
                <div className="space-y-4">
                  {isSubmitting && (
                    <div className="text-sm text-teal-600">Saving department head to database...</div>
                  )}

                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name (e.g., Dr. Priya Nair)"
                        value={adminForm.name}
                        onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={adminForm.phone}
                        onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Employee ID (e.g., MIT-CSE-001)"
                        value={adminForm.empId}
                        onChange={(e) => setAdminForm({ ...adminForm, empId: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">Professional Information</h3>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="md:col-span-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add new department (e.g., Biotechnology)"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          className="flex-1 p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={addDepartmentOption}
                          className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200"
                        >
                          Add Department
                        </button>
                      </div>
                      <div className="relative" ref={departmentMenuRef}>
                        <button
                          type="button"
                          onClick={() => setIsDepartmentMenuOpen((prev) => !prev)}
                          className="w-full p-3 pr-10 text-sm bg-white border border-slate-300 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/40 shadow-sm text-left"
                        >
                          {adminForm.department || 'Select Department'}
                        </button>
                        <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${isDepartmentMenuOpen ? 'rotate-180' : ''}`} />

                        {isDepartmentMenuOpen && (
                          <div className="absolute z-20 mt-2 w-full max-h-44 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setAdminForm({ ...adminForm, department: '' });
                                setIsDepartmentMenuOpen(false);
                              }}
                              className="w-full px-3 py-2.5 text-sm text-left text-slate-500 hover:bg-slate-50"
                            >
                              Select Department
                            </button>
                            {departments.map((dept) => (
                              <button
                                key={dept.id}
                                type="button"
                                onClick={() => {
                                  setAdminForm({ ...adminForm, department: dept.name });
                                  setIsDepartmentMenuOpen(false);
                                }}
                                className={`w-full px-3 py-2.5 text-sm text-left hover:bg-teal-50 ${adminForm.department === dept.name ? 'bg-teal-50 text-teal-700 font-semibold' : 'text-slate-700'}`}
                              >
                                {dept.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Qualification (e.g., Ph.D in Computer Science)"
                        value={adminForm.qualification}
                        onChange={(e) => setAdminForm({ ...adminForm, qualification: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Experience (e.g., 15 years)"
                        value={adminForm.experience}
                        onChange={(e) => setAdminForm({ ...adminForm, experience: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                      <input
                        type="date"
                        placeholder="Joining Date"
                        value={adminForm.joiningDate}
                        onChange={(e) => setAdminForm({ ...adminForm, joiningDate: e.target.value })}
                        className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Specialization (e.g., Artificial Intelligence & Machine Learning)"
                      value={adminForm.specialization}
                      onChange={(e) => setAdminForm({ ...adminForm, specialization: e.target.value })}
                      className="mt-3 p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full h-20"
                      required
                    />
                  </div>
                </div>
              </Modal>
            )}

            {deleteTarget && (
              <div className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Delete Department Head</h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Are you sure you want to delete <span className="font-semibold text-slate-700">{deleteTarget.name}</span>? This action cannot be undone.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(null)}
                      className="px-4 py-2 text-sm text-slate-600 bg-slate-100 border border-slate-200 rounded-xl hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={deleteAdmin}
                      className="px-4 py-2 text-sm text-white bg-red-600 rounded-xl hover:bg-red-700 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
  );
};

export default SuperAdminDashboard;
