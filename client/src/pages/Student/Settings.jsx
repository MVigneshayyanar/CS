import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  Settings as SettingsIcon,
  GraduationCap,
  Shield,
  Hash,
} from "lucide-react";
import { changePassword } from "@/services/authService";
import { fetchStudentDashboard } from "@/services/studentService";
import SectionHeader from "../../components/Student/SectionHeader";

const Field = ({ label, value, icon: Icon }) => (
  <div>
    <label className="block text-[10px] font-black text-muted uppercase tracking-[0.15em] mb-2 opacity-60">
      {label}
    </label>
    <div className="flex items-center gap-3 px-4 py-3 bg-alt/50 border border-theme-light rounded-xl text-heading text-xs font-bold transition-all hover:border-[#1a6b5c]">
      {Icon && <Icon className="w-3.5 h-3.5 text-[#1a6b5c]/70 flex-shrink-0" />}
      {value}
    </div>
  </div>
);

const SectionCard = ({ icon: Icon, title, badge, children }) => (
  <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-6">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#f0f7f5] rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#1a6b5c]" />
        </div>
        <h3 className="text-sm font-black text-heading uppercase tracking-tight">{title}</h3>
      </div>
      {badge && (
        <span className="text-[10px] font-black bg-[#f0f7f5] text-[#134d42] px-3 py-1.5 rounded-full uppercase tracking-widest">
          {badge}
        </span>
      )}
    </div>
    {children}
  </div>
);

const PwField = ({
  label,
  show,
  onToggle,
  value,
  onChange,
  placeholder,
  hint,
}) => (
  <div>
    <label className="block text-[10px] font-black text-muted uppercase tracking-[0.15em] mb-2 opacity-60">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-4 py-3 pr-12 bg-alt/50 border border-theme-light rounded-xl text-xs font-bold text-heading focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-[#1a6b5c] transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-[#1a6b5c] transition-colors"
      >
        {show ? (
          <EyeOff className="w-4 h-4" />
        ) : (
          <Eye className="w-4 h-4" />
        )}
      </button>
    </div>
    {hint && (
      <p className="text-[9px] text-muted mt-1.5 font-bold uppercase tracking-wider opacity-60">{hint}</p>
    )}
  </div>
);

const Settings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const [academicData, setAcademicData] = useState({
    studentId: "—",
    name: "Student",
    email: "—",
    phone: "—",
    department: "Computer Science",
    semester: "—",
    batch: "—",
    section: "—",
    rollNumber: "—",
    yearOfStudy: "—",
    program: "B.Tech",
    labCount: 0,
    pendingCount: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchStudentDashboard();
        if (result?.data?.user) {
          const u = result.data.user;
          const stats = result.data.stats || [];
          const labs = stats.find((s) => s.label.toLowerCase() === "labs")?.value || 0;
          const tasks = stats.find((s) => s.label.toLowerCase() === "pending")?.value || 0;

          setAcademicData({
            studentId: u.username || "—",
            name: u.name || "Student",
            email: u.email || "—",
            phone: "+91 —",
            department: u.department || "Computer Science",
            semester: "Current",
            batch: u.batch || "2024-2025",
            section: "A",
            rollNumber: u.username || "—",
            yearOfStudy: "3rd Year",
            program: "Bachelor of Technology",
            labCount: labs,
            pendingCount: tasks,
          });
        }
      } catch (err) {
        console.error("Failed to load settings data", err);
      }
    };
    loadData();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword)
      return setMessage({ type: "error", text: "New passwords do not match." });
    if (passwordData.newPassword.length < 8)
      return setMessage({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
    setLoading(true);
    try {
      const res = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage({
        type: "success",
        text: res?.message || "Password updated successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Failed to change password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "profile", label: "Academic Profile", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
  ];

  /* strength meter */
  const pwStrength = Math.min(
    4,
    [
      passwordData.newPassword.length >= 8,
      /[A-Z]/.test(passwordData.newPassword),
      /[0-9]/.test(passwordData.newPassword),
      /[^A-Za-z0-9]/.test(passwordData.newPassword),
    ].filter(Boolean).length,
  );

  const strengthColors = [
    "bg-alt",
    "bg-rose-400",
    "bg-amber-400",
    "bg-[#3aa892]",
    "bg-[#1a6b5c]",
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20">
        
        {/* Header */}
        <div className="mb-10">
          <SectionHeader
            icon={SettingsIcon}
            title="Profile Settings"
            subtitle="Secure your account and manage your university-certified academic credentials."
          />
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-8 flex items-center justify-between px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border animate-in slide-in-from-top-4 duration-300 ${
              message.type === "success"
                ? "bg-[#f0f7f5] text-[#134d42] border-[#1a6b5c]/30 shadow-lg shadow-teal-900/5"
                : "bg-rose-50 text-rose-600 border-rose-200 shadow-lg shadow-rose-900/5"
            }`}
          >
            <div className="flex items-center gap-3">
               <Shield className="w-4 h-4" />
               {message.text}
            </div>
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="text-lg leading-none opacity-40 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          
          {/* NAV COLUMN */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Identity Card */}
            <div className="bg-card rounded-3xl border border-theme-light shadow-sm overflow-hidden group">
              <div className="h-20 bg-[#1a6b5c] relative overflow-hidden">
                <SettingsIcon className="absolute -right-4 -top-4 w-20 h-20 text-white opacity-10 group-hover:rotate-45 transition-transform duration-1000" />
              </div>
              <div className="px-6 pb-8 text-center -mt-10 relative z-10">
                <div className="inline-block p-1 bg-card rounded-full shadow-xl mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a6b5c] to-[#134d42] flex items-center justify-center text-white text-xl font-black">
                    {academicData.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>
                <h4 className="text-base font-black text-heading tracking-tight">{academicData.name}</h4>
                <p className="text-[10px] font-black text-[#1a6b5c] uppercase tracking-[0.2em] mt-1">{academicData.studentId}</p>
                <div className="mt-6 flex gap-2">
                   <div className="flex-1 bg-alt py-3 rounded-2xl">
                      <p className="text-sm font-black text-[#1a6b5c]">{academicData.labCount}</p>
                      <p className="text-[8px] font-black text-muted uppercase tracking-widest mt-0.5">Labs</p>
                   </div>
                   <div className="flex-1 bg-alt py-3 rounded-2xl">
                      <p className="text-sm font-black text-rose-500">{academicData.pendingCount}</p>
                      <p className="text-[8px] font-black text-muted uppercase tracking-widest mt-0.5">Pending</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Side Navigation */}
            <nav className="bg-card rounded-2xl border border-theme-light shadow-sm p-3">
              <div className="flex flex-col gap-1.5">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const active = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => {
                        setActiveSection(id);
                        setMessage({ type: "", text: "" });
                      }}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                        active ? "bg-[#f0f7f5] border border-[#dff2ed]" : "hover:bg-alt/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${active ? "bg-[#1a6b5c] text-white" : "bg-alt text-muted"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className={`text-[11px] font-black uppercase tracking-widest ${active ? "text-[#1a6b5c]" : "text-muted"}`}>{label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${active ? "text-[#1a6b5c] translate-x-1" : "text-muted opacity-0 group-hover:opacity-100"}`} />
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* MAIN CONTENT COLUMN */}
          <div className="space-y-6">
             {/* Dynamic Heading Banner */}
             <div className="bg-[#1a6b5c] rounded-3xl p-8 shadow-xl shadow-teal-950/20 text-white relative overflow-hidden group">
                <GraduationCap className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-black tracking-tight mb-2">
                    {activeSection === "profile" ? "Academic Information" : "Security Protocol"}
                  </h2>
                  <p className="text-teal-50/70 text-xs font-bold uppercase tracking-widest max-w-sm leading-relaxed">
                    {activeSection === "profile" 
                      ? "Verifed university credentials and program enrollment data." 
                      : "Manage your authentication factors and account protection settings."}
                  </p>
                </div>
             </div>

             {activeSection === "profile" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <SectionCard icon={User} title="Certified Identity" badge="Verified">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Full Legal Name" value={academicData.name} />
                    <Field label="University Identification" value={academicData.studentId} icon={Hash} />
                    <Field label="Academic Roll No" value={academicData.rollNumber} />
                    <Field label="Contact Email" value={academicData.email} icon={Mail} />
                  </div>
                </SectionCard>

                <SectionCard icon={GraduationCap} title="Program Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Field label="Enrolled Department" value={academicData.department} />
                    <Field label="Admission Batch" value={academicData.batch} />
                  </div>
                </SectionCard>

                <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 flex gap-4">
                  <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-bold text-amber-900/60 uppercase tracking-wide leading-relaxed">
                    <span className="text-amber-600 font-black">Security Note:</span> Academic data is synchronized with the University ERP. Changes require official verification through the Registrar Office.
                  </p>
                </div>
              </div>
             )}

             {activeSection === "password" && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                  <SectionCard icon={Lock} title="Authentication Override">
                    <form onSubmit={handlePasswordChange} className="space-y-8">
                      <PwField
                        label="Primary Password Verification"
                        show={showPw.current}
                        onToggle={() => setShowPw(p => ({ ...p, current: !p.current }))}
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="Current system password"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <PwField
                            label="New Credential"
                            show={showPw.new}
                            onToggle={() => setShowPw(p => ({ ...p, new: !p.new }))}
                            value={passwordData.newPassword}
                            onChange={e => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                            placeholder="Minimum 8 characters"
                            hint="Upper, lower, number required"
                          />
                          {passwordData.newPassword && (
                            <div className="flex gap-1.5 mt-3">
                              {[1, 2, 3, 4].map(i => (
                                <div
                                  key={i}
                                  className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= pwStrength ? strengthColors[pwStrength] : "bg-alt"}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <PwField
                          label="Retry Credential"
                          show={showPw.confirm}
                          onToggle={() => setShowPw(p => ({ ...p, confirm: !p.confirm }))}
                          value={passwordData.confirmPassword}
                          onChange={e => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                          placeholder="Re-type new password"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-3 px-8 py-4 bg-[#1a6b5c] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[#134d42] disabled:opacity-50 transition-all shadow-xl shadow-teal-900/10"
                      >
                        {loading ? "Synchronizing..." : "Commit Changes"}
                        {!loading && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </form>
                  </SectionCard>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
