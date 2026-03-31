import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Palette,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
  Settings as SettingsIcon,
  Briefcase,
  Shield,
  Hash,
  Bell,
  CheckCircle2,
  Users,
  BookOpen
} from "lucide-react";
import { changePassword } from "@/services/authService";
import { fetchFacultyProfile, fetchFacultyDashboard } from "@/services/facultyService";

/* ─── tiny reusable pieces ─── */

const Field = ({ label, value, icon: Icon }) => (
  <div>
    <label className="block text-[9.5px] font-extrabold text-muted uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="flex items-center gap-2 px-3 py-2 bg-alt border border-theme-light rounded-xl text-body text-xs font-semibold">
      {Icon && <Icon className="w-3 h-3 text-muted flex-shrink-0" />}
      {value}
    </div>
  </div>
);

const SectionCard = ({ icon: Icon, title, badge, children }) => (
  <div className="bg-card rounded-2xl border border-theme-light shadow-sm p-5">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[#f0f7f5] rounded-lg flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#1a6b5c]" />
        </div>
        <h3 className="text-sm font-extrabold text-heading">{title}</h3>
      </div>
      {badge && (
        <span className="text-[10px] font-bold bg-[#f0f7f5] text-[#134d42] px-2.5 py-1 rounded-full">
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
    <label className="block text-[9.5px] font-extrabold text-muted uppercase tracking-widest mb-1.5">
      {label}
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full px-3 py-2.5 pr-10 bg-alt border border-theme rounded-xl text-xs text-heading focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-[#3aa892] transition-all"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-body transition-colors"
      >
        {show ? (
          <EyeOff className="w-3.5 h-3.5" />
        ) : (
          <Eye className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
    {hint && (
      <p className="text-[10px] text-muted mt-1 font-medium">{hint}</p>
    )}
  </div>
);

/* ─── main component ─── */

const FacultySettings = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const [profileData, setProfileData] = useState({
    empId: "—",
    name: "Professor",
    email: "—",
    department: "Computer Science",
    designation: "Faculty Member",
    labCount: 0,
    studentCount: 0,
    pendingSubmissions: 0,
    overallCompletion: 0,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, dashboardRes] = await Promise.all([
          fetchFacultyProfile(),
          fetchFacultyDashboard()
        ]);
        
        if (profileRes?.data) {
          const p = profileRes.data;
          const d = dashboardRes?.data?.quickStats || {};
          
          setProfileData({
            empId: p.username || "—",
            name: p.name || "Professor",
            email: p.email || "—",
            department: p.department || "Computer Science",
            designation: p.designation || "Faculty Member",
            labCount: d.totalClasses || 0,
            studentCount: d.totalStudents || 0,
            pendingSubmissions: d.pendingSubmissions || 0,
            overallCompletion: d.overallCompletion || 0,
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
    { id: "profile", label: "Faculty Profile", icon: User },
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
    "bg-red-400",
    "bg-amber-400",
    "bg-[#3aa892]",
    "bg-[#1a6b5c]",
  ];

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        {/* ── Top bar ── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a6b5c] rounded-xl flex items-center justify-center shadow-md shadow-[#2a8c78]/20">
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-heading leading-tight">
                Faculty Account
              </h1>
              <p className="text-xs text-muted">
                Manage your credentials and academic info
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-theme rounded-xl text-xs font-bold text-body hover:bg-alt transition-all shadow-sm">
            <Bell className="w-3.5 h-3.5" />
            Notifications
          </button>
        </div>

        {/* ── Alert ── */}
        {message.text && (
          <div
            className={`mb-5 flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold border ${message.type === "success"
              ? "bg-[#f0f7f5] text-[#134d42] border-[#c2e6de]"
              : "bg-red-50 text-red-600 border-red-200"
              }`}
          >
            {message.text}
            <button
              onClick={() => setMessage({ type: "", text: "" })}
              className="ml-auto text-lg leading-none opacity-40 hover:opacity-80"
            >
              ×
            </button>
          </div>
        )}

        <div className="flex gap-5 items-start">
          {/* ══ LEFT SIDEBAR ══ */}
          <div className="w-56 flex-shrink-0 flex flex-col gap-4 sticky top-8">
            {/* Profile card with teal banner */}
            <div className="bg-card rounded-2xl border border-theme-light shadow-sm overflow-hidden">
              {/* Banner */}
              <div className="relative bg-[#1a6b5c] h-16 overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-card opacity-10" />
                <div className="absolute -right-1 top-6 w-14 h-14 rounded-full bg-card opacity-10" />
              </div>
              {/* Body */}
              <div className="px-5 pb-5 text-center">
                <div className="relative inline-block -mt-7 mb-2.5">
                  <div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-[#3aa892] to-[#134d42] border-3 border-white flex items-center justify-center text-white text-lg font-extrabold shadow-lg"
                    style={{ border: "3px solid white" }}
                  >
                    {profileData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-[#2a8c78] border-2 border-white rounded-full" />
                </div>
                <p className="text-sm font-extrabold text-heading">
                  {profileData.name}
                </p>
                <p className="text-[11px] text-[#1a6b5c] font-bold mt-0.5">
                  ID: {profileData.empId}
                </p>
                <p className="text-[10.5px] text-muted mt-0.5">
                  {profileData.designation}
                </p>
                <span className="inline-block mt-2 text-[10px] font-extrabold bg-[#f0f7f5] text-[#134d42] px-3 py-1 rounded-full">
                  Verified Faculty
                </span>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-alt rounded-xl py-2.5 text-center">
                    <div className="text-lg font-extrabold text-[#1a6b5c]">
                      {profileData.labCount}
                    </div>
                    <div className="text-[10px] text-muted font-semibold">
                      Labs
                    </div>
                  </div>
                  <div className="bg-alt rounded-xl py-2.5 text-center">
                    <div className="text-lg font-extrabold text-amber-500">
                      {profileData.pendingSubmissions}
                    </div>
                    <div className="text-[10px] text-muted font-semibold">
                      New
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="bg-card rounded-2xl border border-theme-light shadow-sm p-2.5">
              <ul className="space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => {
                  const active = activeSection === id;
                  return (
                    <li key={id}>
                      <button
                        onClick={() => {
                          setActiveSection(id);
                          setMessage({ type: "", text: "" });
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${active ? "bg-[#f0f7f5]" : "hover:bg-alt"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${active ? "bg-[#dff2ed]" : "bg-alt"}`}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${active ? "text-[#1a6b5c]" : "text-muted"}`}
                            />
                          </div>
                          <span
                            className={`text-[11.5px] font-bold ${active ? "text-[#134d42]" : "text-body"}`}
                          >
                            {label}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-3 h-3 flex-shrink-0 ${active ? "text-[#3aa892]" : "text-muted"}`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* ══ MAIN CONTENT ══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* Teal Banner */}
            <div className="relative bg-[#1a6b5c] rounded-2xl px-6 py-5 flex items-center justify-between overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-lg font-extrabold text-white mb-1">
                  {activeSection === "profile" && "Faculty Profile"}
                  {activeSection === "password" && "Change Password"}
                </h2>
                <p className="text-teal-100 text-xs max-w-sm leading-relaxed">
                  {activeSection === "profile" &&
                    "View and verify your registered academic credentials."}
                  {activeSection === "password" &&
                    "Keep your account secure by updating your password regularly."}
                </p>
              </div>
              {/* Hex deco */}
              <div className="flex gap-2 opacity-90 pointer-events-none select-none">
                <div className="flex flex-col gap-2">
                  <div
                    style={{
                      width: 44,
                      height: 52,
                      background: "rgba(255,255,255,.15)",
                      clipPath:
                        "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                    }}
                  />
                  <div
                    style={{
                      width: 28,
                      height: 34,
                      background: "rgba(255,215,0,.3)",
                      clipPath:
                        "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                      alignSelf: "flex-end",
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 mt-3">
                  <div
                    style={{
                      width: 28,
                      height: 34,
                      background: "rgba(255,215,0,.3)",
                      clipPath:
                        "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                    }}
                  />
                  <div
                    style={{
                      width: 44,
                      height: 52,
                      background: "rgba(255,255,255,.15)",
                      clipPath:
                        "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── PROFILE SECTION ── */}
            {activeSection === "profile" && (
              <>
                <SectionCard
                  icon={Briefcase}
                  title="Professional Info"
                  badge="Verified"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Full Name" value={profileData.name} />
                    <Field
                      label="Employee ID"
                      value={profileData.empId}
                      icon={Hash}
                    />
                    <Field
                      label="Designation"
                      value={profileData.designation}
                    />
                    <Field
                      label="Email Address"
                      value={profileData.email}
                      icon={Mail}
                    />
                  </div>
                </SectionCard>

                <SectionCard
                  icon={BookOpen}
                  title="Academic Scope"
                  badge="Read only"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Department" value={profileData.department} />
                    <Field label="Total Assigned Labs" value={profileData.labCount} />
                    <Field label="Students Managed" value={profileData.studentCount} />
                    <Field
                      label="Overall Class Completion"
                      value={`${profileData.overallCompletion}%`}
                      icon={CheckCircle2}
                    />
                  </div>
                </SectionCard>

                <div className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
                  <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-800 font-medium leading-relaxed">
                    <strong>Note:</strong> Faculty credentials and departmental assignments are locked by the system admin. For change requests, contact the IT department or Admin desk.
                  </p>
                </div>
              </>
            )}

            {/* ── PASSWORD SECTION ── */}
            {activeSection === "password" && (
              <SectionCard icon={Lock} title="Update Your Password">
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <PwField
                      label="Current Password"
                      show={showPw.current}
                      onToggle={() =>
                        setShowPw((p) => ({ ...p, current: !p.current }))
                      }
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData((p) => ({
                          ...p,
                          currentPassword: e.target.value,
                        }))
                      }
                      placeholder="Enter your current password"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <PwField
                          label="New Password"
                          show={showPw.new}
                          onToggle={() =>
                            setShowPw((p) => ({ ...p, new: !p.new }))
                          }
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((p) => ({
                              ...p,
                              newPassword: e.target.value,
                            }))
                          }
                          placeholder="Enter new password"
                          hint="At least 8 characters"
                        />
                        {/* Strength bar */}
                        {passwordData.newPassword && (
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? strengthColors[pwStrength] : "bg-alt"}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <PwField
                        label="Confirm New Password"
                        show={showPw.confirm}
                        onToggle={() =>
                          setShowPw((p) => ({ ...p, confirm: !p.confirm }))
                        }
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData((p) => ({
                            ...p,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a6b5c] text-white text-xs font-extrabold rounded-xl hover:bg-[#134d42] disabled:opacity-50 transition-all shadow-sm shadow-teal-200"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultySettings;
