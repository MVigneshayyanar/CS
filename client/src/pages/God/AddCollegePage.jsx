import React, { useState } from 'react';
import {
  Building2,
  ArrowLeft,
  Save,
  MapPin,
  Phone,
  User,
  CalendarDays,
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { addCollege, fetchCollegeById, updateCollege } from '@/services/godService';

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

const AddCollegePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const collegeId = searchParams.get('id');
  const isEdit = Boolean(collegeId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEdit);

  const [collegeForm, setCollegeForm] = useState({
    name: '',
    code: '',
    officialDomain: '',
    location: '',
    country: '',
    address: '',
    established: '',
    type: '',
    affiliation: '',
    phone: '',
    email: '',
    website: '',
    primaryContactName: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    principalName: '',
    departmentsCsv: '',
    programsCsv: '',
    superAdminName: '',
    superAdminEmail: '',
    superAdminPhone: '',
    superAdminEmpId: '',
    status: 'active',
  });

  React.useEffect(() => {
    if (isEdit) {
      const loadCollege = async () => {
        try {
          const result = await fetchCollegeById(collegeId);
          const c = result?.data?.college;
          if (c) {
            // Pre-fill college data
            setCollegeForm((prev) => ({
              ...prev,
              ...c,
              departmentsCsv: (c.departments || []).join(', '),
              programsCsv: (c.programs || []).join(', '),
              // If there's an existing super admin, pre-fill the first one
              superAdminName: c.superAdmins?.[0]?.name || '',
              superAdminEmail: c.superAdmins?.[0]?.email || '',
              superAdminPhone: c.superAdmins?.[0]?.phone || '',
              superAdminEmpId: c.superAdmins?.[0]?.empId || '',
            }));
          }
        } catch (error) {
          console.error('Error fetching college:', error);
          const message = toFriendlyGodSetupMessage(error?.response?.data?.message) || error.message;
          alert(`Failed to load college details: ${message}`);
        } finally {
          setIsLoading(false);
        }
      };
      loadCollege();
    }
  }, [collegeId, isEdit]);

  const handleSubmit = async () => {
    if (!collegeForm.name || !collegeForm.code) {
      alert('College name and code are required.');
      return;
    }

    const payload = {
      ...collegeForm,
      departments: (collegeForm.departmentsCsv || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      programs: (collegeForm.programsCsv || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setIsSubmitting(true);
    try {
      if (isEdit) {
        await updateCollege(collegeId, payload);
        alert('College updated successfully.');
      } else {
        await addCollege(payload);
        alert('College created successfully.');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting college:', error);
      const message =
        toFriendlyGodSetupMessage(error?.response?.data?.message) ||
        `Failed to ${isEdit ? 'update' : 'create'} college.`;
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <p className="text-body text-lg">Loading college details...</p>
      </div>
    );
  }

  const inputClassName =
    'p-4 bg-card border border-theme rounded-lg text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78]';

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 md:pt-8 pb-10 sm:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-md shadow-[#2a8c78]/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-heading leading-tight">
                {isEdit ? 'Edit College' : 'Add New College'}
              </h1>
              <p className="text-xs text-muted">
                {isEdit ? 'Update institutional details' : 'Create a college record for god mode'}
              </p>
            </div>
          </div>
        </div>

        <div className="relative bg-[#1a6b5c] rounded-2xl px-4 sm:px-6 py-5 flex items-center justify-between overflow-hidden mb-5">
          <div className="relative z-10">
            <h2 className="text-lg font-extrabold text-white mb-1">
              {isEdit ? 'Update College Details' : 'College Setup'}
            </h2>
            <p className="text-teal-100 text-xs max-w-sm leading-relaxed">
              {isEdit 
                ? 'Modify the institution details to update the record in god mode.' 
                : 'Fill out the institution details to create a new college.'}
            </p>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/10 -mr-4" />
        </div>

        <div className="space-y-5">
          <div className="bg-card border border-theme rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#1a6b5c]" />
              </div>
              <h3 className="text-sm font-extrabold text-heading">Basic Information</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="College Name"
                value={collegeForm.name}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, name: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="College Code (e.g., MIT)"
                value={collegeForm.code}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="Official Email Domain (e.g., mit.edu)"
                value={collegeForm.officialDomain}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, officialDomain: e.target.value.toLowerCase() }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="Location (City, State)"
                value={collegeForm.location}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, location: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="Country"
                value={collegeForm.country}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, country: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="Established Year"
                value={collegeForm.established}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, established: e.target.value }))}
                className={inputClassName}
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
                className={inputClassName}
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
                  onChange={(e) => setCollegeForm((prev) => ({ ...prev, affiliation: e.target.value }))}
                  className={inputClassName}
                />
              )}
            </div>
            <textarea
              placeholder="Full Address"
              value={collegeForm.address}
              onChange={(e) => setCollegeForm((prev) => ({ ...prev, address: e.target.value }))}
              className="mt-4 p-4 bg-card border border-theme rounded-lg text-heading placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2a8c78] focus:border-[#2a8c78] transition-all w-full h-20"
            />
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-[#1a6b5c]" />
              </div>
              <h3 className="text-sm font-extrabold text-heading">Contact Information</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="tel"
                placeholder="Phone Number"
                value={collegeForm.phone}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, phone: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={collegeForm.email}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, email: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="url"
                placeholder="Website"
                value={collegeForm.website}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, website: e.target.value }))}
                className={inputClassName}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="Primary Contact Name"
                value={collegeForm.primaryContactName}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, primaryContactName: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="Principal / Nodal Officer Name"
                value={collegeForm.principalName}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, principalName: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="email"
                placeholder="Primary Contact Email"
                value={collegeForm.primaryContactEmail}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, primaryContactEmail: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="tel"
                placeholder="Primary Contact Phone"
                value={collegeForm.primaryContactPhone}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, primaryContactPhone: e.target.value }))}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-[#1a6b5c]" />
              </div>
              <h3 className="text-sm font-extrabold text-heading">Academic Calendar</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-body mb-2">Start Date</label>
                <input
                  type="date"
                  value={collegeForm.academicStartDate}
                  onChange={(e) => setCollegeForm((prev) => ({ ...prev, academicStartDate: e.target.value }))}
                  className={`${inputClassName} cursor-pointer w-full`}
                  style={{ colorScheme: 'light' }}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-body mb-2">End Date</label>
                <input
                  type="date"
                  value={collegeForm.academicEndDate}
                  onChange={(e) => setCollegeForm((prev) => ({ ...prev, academicEndDate: e.target.value }))}
                  className={`${inputClassName} cursor-pointer w-full`}
                  style={{ colorScheme: 'light' }}
                />
              </div>
            </div>
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#1a6b5c]" />
              </div>
              <h3 className="text-sm font-extrabold text-heading">Initial Super Admin Access</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Super Admin Name"
                value={collegeForm.superAdminName}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, superAdminName: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="email"
                placeholder="Super Admin Email"
                value={collegeForm.superAdminEmail}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, superAdminEmail: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="tel"
                placeholder="Super Admin Phone"
                value={collegeForm.superAdminPhone}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, superAdminPhone: e.target.value }))}
                className={inputClassName}
              />
              <input
                type="text"
                placeholder="Super Admin Employee ID"
                value={collegeForm.superAdminEmpId}
                onChange={(e) => setCollegeForm((prev) => ({ ...prev, superAdminEmpId: e.target.value }))}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="bg-card border border-theme rounded-2xl shadow-sm p-4 sm:p-5">
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-2 text-body bg-alt border border-theme rounded-lg hover:bg-alt w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#1a6b5c] text-white rounded-lg hover:bg-[#134d42] transition-all flex items-center justify-center shadow-sm w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving...' : isEdit ? 'Update College' : 'Save College'}
            </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCollegePage;