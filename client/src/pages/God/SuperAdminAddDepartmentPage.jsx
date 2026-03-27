import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { addDepartmentAdmin, addSuperAdminDepartment, fetchSuperAdminCollege } from '@/services/superAdminService';

const SuperAdminAddDepartmentPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [college, setCollege] = useState(null);
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    department: '',
    qualification: '',
    experience: '',
    specialization: '',
  });
  const [adminDepartmentFilter, setAdminDepartmentFilter] = useState('all');

  const departments = useMemo(() => college?.departments || [], [college]);
  const departmentHeads = useMemo(() => college?.departmentHeads || [], [college]);

  const filteredAdmins = useMemo(() => {
    if (adminDepartmentFilter === 'all') {
      return departmentHeads;
    }

    return departmentHeads.filter(
      (admin) => (admin.department || '').toLowerCase() === adminDepartmentFilter.toLowerCase()
    );
  }, [adminDepartmentFilter, departmentHeads]);

  const loadCollege = async () => {
    try {
      const result = await fetchSuperAdminCollege();
      setCollege(result?.data?.college || null);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to load college data';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollege();
  }, []);

  useEffect(() => {
    if (!adminForm.department && departments.length > 0) {
      setAdminForm((prev) => ({ ...prev, department: departments[0] }));
    }
  }, [adminForm.department, departments]);

  const handleAddDepartment = async () => {
    const name = newDepartment.trim();
    if (!name) {
      alert('Department name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addSuperAdminDepartment(name);
      setNewDepartment('');
      await loadCollege();
      alert('Department added successfully.');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add department';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminFieldChange = (field, value) => {
    setAdminForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetAdminForm = () => {
    setAdminForm({
      name: '',
      email: '',
      phone: '',
      empId: '',
      department: departments[0] || '',
      qualification: '',
      experience: '',
      specialization: '',
    });
  };

  const validateAdminForm = () => {
    const requiredFields = [
      ['name', 'Full Name'],
      ['email', 'Email'],
      ['empId', 'Employee ID'],
      ['department', 'Department'],
      ['qualification', 'Qualification'],
      ['experience', 'Experience'],
      ['specialization', 'Specialization'],
    ];

    const missing = requiredFields
      .filter(([key]) => !(adminForm[key] || '').trim())
      .map(([, label]) => label);

    if (missing.length > 0) {
      alert(`Please fill required fields: ${missing.join(', ')}`);
      return false;
    }

    return true;
  };

  const handleAddAdmin = async () => {
    if (!validateAdminForm()) {
      return;
    }

    setIsAddingAdmin(true);
    try {
      const result = await addDepartmentAdmin({
        ...adminForm,
        permissions: [],
      });

      const credentials = result?.data?.credentials;
      await loadCollege();
      resetAdminForm();

      if (credentials?.username && credentials?.password) {
        alert(`Admin created successfully.\nUsername: ${credentials.username}\nPassword: ${credentials.password}`);
      } else {
        alert('Admin created successfully.');
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to add admin';
      alert(message);
    } finally {
      setIsAddingAdmin(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        <div className="mb-8">
          <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-5">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">Add Department</h1>
                <p className="text-xs text-teal-100">Create departments for your college</p>
              </div>
            </div>
            <div className="text-xs text-teal-100">{college?.name || 'College'}</div>
            <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mb-5">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Department name (e.g., Computer Science Engineering)"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                className="flex-1 p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddDepartment}
                disabled={isSubmitting}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-sm font-semibold flex items-center justify-center disabled:opacity-70"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                {isSubmitting ? 'Adding...' : 'Add Department'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-700">All Departments</p>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {departments.length} department{departments.length === 1 ? '' : 's'}
              </span>
            </div>

            {isLoading ? (
              <div className="text-sm text-slate-500">Loading departments...</div>
            ) : departments.length === 0 ? (
              <div className="text-sm text-slate-500">No departments added yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {departments.map((department, index) => (
                  <div key={`${department}-${index}`} className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-700">
                    {department}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mt-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-700">Add Department Admin</p>
              {/* <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Old field form
              </span> */}
            </div>

            {departments.length === 0 ? (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                Add at least one department first, then create admin department-wise.
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={adminForm.name}
                    onChange={(e) => handleAdminFieldChange('name', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={adminForm.email}
                    onChange={(e) => handleAdminFieldChange('email', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={adminForm.phone}
                    onChange={(e) => handleAdminFieldChange('phone', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={adminForm.empId}
                    onChange={(e) => handleAdminFieldChange('empId', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <select
                    value={adminForm.department}
                    onChange={(e) => handleAdminFieldChange('department', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Select Department</option>
                    {departments.map((department, index) => (
                      <option key={`${department}-${index}`} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Qualification"
                    value={adminForm.qualification}
                    onChange={(e) => handleAdminFieldChange('qualification', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Experience"
                    value={adminForm.experience}
                    onChange={(e) => handleAdminFieldChange('experience', e.target.value)}
                    className="p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <textarea
                  placeholder="Specialization"
                  value={adminForm.specialization}
                  onChange={(e) => handleAdminFieldChange('specialization', e.target.value)}
                  className="mt-3 p-3 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 w-full h-24 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={handleAddAdmin}
                    disabled={isAddingAdmin}
                    className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all text-sm font-semibold disabled:opacity-70"
                  >
                    {isAddingAdmin ? 'Adding Admin...' : 'Add Admin'}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm mt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <p className="text-sm font-bold text-slate-700">Department Admins</p>
              <select
                value={adminDepartmentFilter}
                onChange={(e) => setAdminDepartmentFilter(e.target.value)}
                className="p-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Departments</option>
                {departments.map((department, index) => (
                  <option key={`${department}-filter-${index}`} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            {filteredAdmins.length === 0 ? (
              <div className="text-sm text-slate-500">No admins found for selected department.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredAdmins.map((admin) => (
                  <div key={admin.id} className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <p className="text-sm font-bold text-slate-800">{admin.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{admin.email}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                        {admin.department}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
                        {admin.empId}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminAddDepartmentPage;
