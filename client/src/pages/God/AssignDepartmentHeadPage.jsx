import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Plus, Save, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createDepartmentHead, fetchSuperAdminCollege } from '@/services/superAdminService';

const buildDepartments = (departmentNames = []) =>
  departmentNames.map((name, index) => ({
    id: `dept-${index}-${name}`,
    name,
  }));

const AssignDepartmentHeadPage = () => {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isDepartmentMenuOpen, setIsDepartmentMenuOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');

  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    empId: '',
    department: '',
    qualification: '',
    experience: '',
    specialization: '',
    permissions: [],
  });

  useEffect(() => {
    const loadCollegeData = async () => {
      try {
        const result = await fetchSuperAdminCollege();
        const collegeData = result?.data?.college;
        if (collegeData?.departments?.length) {
          setDepartments(buildDepartments(collegeData.departments));
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load departments';
        alert(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadCollegeData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsDepartmentMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const addDepartmentOption = () => {
    const name = newDepartmentName.trim();
    if (!name) {
      return;
    }

    const exists = departments.some((dept) => dept.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert('Department already exists. Please select it from the list.');
      return;
    }

    const nextDepartment = { id: `dept-local-${Date.now()}`, name };
    setDepartments((prev) => [...prev, nextDepartment]);
    setAdminForm((prev) => ({ ...prev, department: name }));
    setNewDepartmentName('');
    setIsDepartmentMenuOpen(false);
  };

  const missingFields = useMemo(() => {
    const required = [
      ['name', 'Full Name'],
      ['email', 'Email Address'],
      ['phone', 'Phone Number'],
      ['empId', 'Employee ID'],
      ['department', 'Department'],
      ['qualification', 'Qualification'],
      ['experience', 'Experience'],
      ['specialization', 'Specialization'],
    ];

    return required
      .filter(([key]) => {
        const value = adminForm[key];
        return typeof value === 'string' ? !value.trim() : !value;
      })
      .map(([, label]) => label);
  }, [adminForm]);

  const handleSubmit = async () => {
    if (missingFields.length > 0) {
      alert(`Please fill all mandatory fields: ${missingFields.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createDepartmentHead(adminForm);
      const created = result?.data?.departmentHead;
      const credentials = result?.data?.credentials;

      if (created) {
        const username = created.username || created.empId;
        const password = credentials?.password || created.empId;
        alert(`Department head assigned successfully.\nUsername: ${username}\nPassword: ${password}`);
      } else {
        alert('Department head assigned successfully.');
      }

      navigate('/dashboard');
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to assign department head';
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-3rem)] overflow-hidden bg-page">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 md:pt-6 pb-4 sm:pb-6">
        <div className="mb-5">
          <div className="relative bg-[#1a6b5c] rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-5">
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <UserCog className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white leading-tight">Assign Department Head</h1>
                <p className="text-xs text-teal-100">Create a new department head account</p>
              </div>
            </div>
            {/* <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="relative z-10 bg-card text-[#134d42] px-4 py-2 rounded-xl hover:bg-[#f0f7f5] transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Back to Dashboard
            </button> */}
            <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
          </div>
        </div>

        <div className="bg-card border border-theme rounded-2xl p-5 sm:p-6 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex items-center gap-3 text-muted py-10 justify-center">
              <div className="w-5 h-5 border-2 border-[#2a8c78] border-t-transparent rounded-full animate-spin" />
              Loading form...
            </div>
          ) : (
            <div className="space-y-6">
              {isSubmitting && <div className="text-sm text-[#1a6b5c]">Saving department head to database...</div>}

              <div>
                <h3 className="text-base font-bold text-heading mb-3">Personal Information</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Full Name (e.g., Dr. Priya Nair)"
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={adminForm.phone}
                    onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                    className="p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Employee ID (e.g., MIT-CSE-001)"
                    value={adminForm.empId}
                    onChange={(e) => setAdminForm({ ...adminForm, empId: e.target.value })}
                    className="p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-heading mb-3">Professional Information</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="md:col-span-2 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add new department (e.g., Biotechnology)"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="flex-1 p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    />
                    <button
                      type="button"
                      onClick={addDepartmentOption}
                      className="px-4 py-2 text-sm bg-alt hover:bg-alt text-heading rounded-xl border border-theme"
                    >
                      Add Department
                    </button>
                  </div>

                  <div className="relative" ref={menuRef}>
                    <button
                      type="button"
                      onClick={() => setIsDepartmentMenuOpen((prev) => !prev)}
                      className="w-full p-3 pr-10 text-sm bg-card border border-theme rounded-xl text-heading focus:outline-none focus:ring-2 focus:ring-[#2a8c78]/40 shadow-sm text-left"
                    >
                      {adminForm.department || 'Select Department'}
                    </button>
                    <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted transition-transform ${isDepartmentMenuOpen ? 'rotate-180' : ''}`} />

                    {isDepartmentMenuOpen && (
                      <div className="absolute z-20 mt-2 w-full max-h-44 overflow-y-auto bg-card border border-theme rounded-xl shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setAdminForm({ ...adminForm, department: '' });
                            setIsDepartmentMenuOpen(false);
                          }}
                          className="w-full px-3 py-2.5 text-sm text-left text-body hover:bg-alt"
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
                            className={`w-full px-3 py-2.5 text-sm text-left hover:bg-[#f0f7f5] ${adminForm.department === dept.name ? 'bg-[#f0f7f5] text-[#134d42] font-semibold' : 'text-heading'}`}
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
                    className="p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Experience (e.g., 15 years)"
                    value={adminForm.experience}
                    onChange={(e) => setAdminForm({ ...adminForm, experience: e.target.value })}
                    className="p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78]"
                    required
                  />
                </div>

                <textarea
                  placeholder="Specialization (e.g., Artificial Intelligence & Machine Learning)"
                  value={adminForm.specialization}
                  onChange={(e) => setAdminForm({ ...adminForm, specialization: e.target.value })}
                  className="mt-3 p-3 text-sm bg-card border border-theme rounded-xl text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] w-full h-20"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-theme">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="px-5 py-2 text-sm text-body bg-alt border border-theme rounded-xl hover:bg-alt transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm bg-[#1a6b5c] text-white rounded-xl hover:bg-[#134d42] transition-all flex items-center shadow-md disabled:opacity-70"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Saving...' : 'Assign Department Head'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignDepartmentHeadPage;
