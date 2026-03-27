import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, Search, Shield, Users, GraduationCap } from 'lucide-react';
import { fetchSuperAdminCollege } from '@/services/superAdminService';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [college, setCollege] = useState(null);

  const loadCollegeData = async () => {
    try {
      setError('');
      const result = await fetchSuperAdminCollege();
      const collegeData = result?.data?.college;

      if (!collegeData) {
        throw new Error('No college data found');
      }

      setCollege(collegeData);
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Failed to load dashboard data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollegeData();
  }, []);

  const departmentWiseCounts = useMemo(() => {
    return Array.isArray(college?.departmentWiseCounts) ? college.departmentWiseCounts : [];
  }, [college]);

  const filteredDepartments = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) {
      return departmentWiseCounts;
    }

    return departmentWiseCounts.filter((item) =>
      (item.departmentName || item.department || item.name || '').toLowerCase().includes(keyword)
    );
  }, [departmentWiseCounts, searchTerm]);

  const totals = useMemo(
    () => ({
      departments: departmentWiseCounts.length,
      admins: Number(college?.adminCount) || 0,
      faculty: Number(college?.facultyCount) || 0,
      students: Number(college?.studentCount) || 0,
    }),
    [college, departmentWiseCounts]
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        <div className="relative bg-teal-600 rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white leading-tight">Super Admin Dashboard</h1>
              <p className="text-xs text-teal-100">Departments and member counts overview</p>
            </div>
          </div>

          {/* <button
            type="button"
            onClick={() => navigate('/add-department')}
            className="relative z-10 bg-white text-teal-700 px-4 py-2 rounded-xl hover:bg-teal-50 transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Department
          </button> */}

          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-slate-500 py-20 justify-center">
            <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
            Loading college data...
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 text-red-700 rounded-2xl shadow-sm p-6">{error}</div>
        ) : !college ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center text-slate-500">
            No college data found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 break-words">{college.name}</h2>
                  <p className="text-slate-500 text-sm mt-1">{college.code}</p>
                </div>
                <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium border border-teal-100 w-fit">
                  Super Admin Panel
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Departments</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{totals.departments}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Admins</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{totals.admins}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Faculty</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{totals.faculty}</p>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Students</p>
                <p className="text-3xl font-extrabold text-slate-900 mt-2">{totals.students}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-slate-900">Department Member Counts</h3>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {filteredDepartments.length} department{filteredDepartments.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl w-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              {filteredDepartments.length === 0 ? (
                <div className="text-center py-10 text-slate-500 border border-dashed border-slate-200 rounded-xl">
                  No departments found.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDepartments.map((item, index) => {
                    const departmentLabel = item.departmentName || item.department || item.name || `Department ${index + 1}`;

                    return (
                    <div key={`${departmentLabel}-${index}`} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70">
                      <h4 className="text-base font-bold text-slate-900 mb-3">{departmentLabel}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="inline-flex items-center gap-1.5"><Shield className="w-4 h-4 text-teal-600" /> Admins</span>
                          <span className="font-bold">{Number(item.adminCount) || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-cyan-600" /> Faculty</span>
                          <span className="font-bold">{Number(item.facultyCount) || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-700">
                          <span className="inline-flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-emerald-600" /> Students</span>
                          <span className="font-bold">{Number(item.studentCount) || 0}</span>
                        </div>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
