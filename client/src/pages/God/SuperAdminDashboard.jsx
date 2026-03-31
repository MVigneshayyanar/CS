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
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        <div className="relative bg-[#1a6b5c] rounded-2xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between overflow-hidden gap-4 mb-6">
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
            className="relative z-10 bg-card text-[#134d42] px-4 py-2 rounded-xl hover:bg-[#f0f7f5] transition-all flex items-center justify-center shadow-sm text-sm font-semibold w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Department
          </button> */}

          <div className="absolute -right-8 -top-6 w-32 h-32 rounded-full bg-white/10" />
        </div>

        {isLoading ? (
          <div className="flex items-center gap-3 text-body py-20 justify-center">
            <div className="w-5 h-5 border-2 border-[#2a8c78] border-t-transparent rounded-full animate-spin" />
            Loading college data...
          </div>
        ) : error ? (
          <div className="bg-card border border-red-200 text-red-700 rounded-2xl shadow-sm p-6">{error}</div>
        ) : !college ? (
          <div className="bg-card border border-theme rounded-2xl shadow-sm p-10 text-center text-body">
            No college data found.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card border border-theme rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-heading break-words">{college.name}</h2>
                  <p className="text-body text-sm mt-1">{college.code}</p>
                </div>
                <span className="bg-[#f0f7f5] text-[#134d42] px-3 py-1 rounded-full text-sm font-medium border border-[#dff2ed] w-fit">
                  Super Admin Panel
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-body uppercase tracking-wide">Departments</p>
                <p className="text-3xl font-extrabold text-heading mt-2">{totals.departments}</p>
              </div>
              <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-body uppercase tracking-wide">Admins</p>
                <p className="text-3xl font-extrabold text-heading mt-2">{totals.admins}</p>
              </div>
              <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-body uppercase tracking-wide">Faculty</p>
                <p className="text-3xl font-extrabold text-heading mt-2">{totals.faculty}</p>
              </div>
              <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-body uppercase tracking-wide">Students</p>
                <p className="text-3xl font-extrabold text-heading mt-2">{totals.students}</p>
              </div>
            </div>

            <div className="bg-card border border-theme rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-heading">Department Member Counts</h3>
                <span className="text-xs font-semibold text-body bg-alt px-2.5 py-1 rounded-full">
                  {filteredDepartments.length} department{filteredDepartments.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-alt border border-theme rounded-xl w-full text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all"
                />
              </div>

              {filteredDepartments.length === 0 ? (
                <div className="text-center py-10 text-body border border-dashed border-theme rounded-xl">
                  No departments found.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredDepartments.map((item, index) => {
                    const departmentLabel = item.departmentName || item.department || item.name || `Department ${index + 1}`;

                    return (
                    <div key={`${departmentLabel}-${index}`} className="border border-theme rounded-2xl p-4 bg-alt/70">
                      <h4 className="text-base font-bold text-heading mb-3">{departmentLabel}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between text-heading">
                          <span className="inline-flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#1a6b5c]" /> Admins</span>
                          <span className="font-bold">{Number(item.adminCount) || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-heading">
                          <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-[#1a6b5c]" /> Faculty</span>
                          <span className="font-bold">{Number(item.facultyCount) || 0}</span>
                        </div>
                        <div className="flex items-center justify-between text-heading">
                          <span className="inline-flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-[#1a6b5c]" /> Students</span>
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
