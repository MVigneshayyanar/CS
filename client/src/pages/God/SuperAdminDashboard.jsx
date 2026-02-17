import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserCog, Search, Save, X, Mail, User, Building2, GraduationCap, Shield, Phone } from 'lucide-react';

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
  const [currentCollege] = useState('MIT Institute of Technology');
 
  const [departments] = useState([
    { id: 1, name: 'Computer Science Engineering', code: 'CSE', totalStudents: 800, totalFaculty: 45 },
    { id: 2, name: 'Information Technology', code: 'IT', totalStudents: 600, totalFaculty: 35 },
    { id: 3, name: 'Electronics & Communication', code: 'ECE', totalStudents: 500, totalFaculty: 30 },
    { id: 4, name: 'Electrical & Electronics', code: 'EEE', totalStudents: 400, totalFaculty: 25 },
    { id: 5, name: 'Mechanical Engineering', code: 'MECH', totalStudents: 350, totalFaculty: 22 },
    { id: 6, name: 'Civil Engineering', code: 'CIVIL', totalStudents: 300, totalFaculty: 20 }
  ]);

  const [admins, setAdmins] = useState([
    {
      id: 1,
      name: 'Dr. Priya Nair',
      email: 'priya.nair@mit.edu',
      phone: '+91-98765-43210',
      empId: 'MIT-CSE-001',
      department: 'Computer Science Engineering',
      role: 'Department Head',
      qualification: 'Ph.D in Computer Science',
      experience: '15 years',
      specialization: 'Artificial Intelligence & Machine Learning',
      joiningDate: '2020-08-15',
      permissions: ['manage_students', 'manage_faculty', 'manage_labs', 'view_reports', 'conduct_exams']
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@mit.edu',
      phone: '+91-98765-43211',
      empId: 'MIT-IT-001',
      department: 'Information Technology',
      role: 'Department Head',
      qualification: 'Ph.D in Information Technology',
      experience: '12 years',
      specialization: 'Database Systems & Cloud Computing',
      joiningDate: '2021-01-10',
      permissions: ['manage_students', 'manage_faculty', 'manage_labs', 'view_reports']
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
  };

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

  const handleSubmit = () => {
    const newId = Date.now();
   
    if (editingItem) {
      setAdmins(admins.map(a =>
        a.id === editingItem.id
          ? { ...adminForm, id: editingItem.id, role: 'Department Head' }
          : a
      ));
    } else {
      setAdmins([...admins, {
        ...adminForm,
        id: newId,
        role: 'Department Head'
      }]);
    }
    closeModal();
  };

  const deleteAdmin = (id) => {
    setAdmins(admins.filter(a => a.id !== id));
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPermissionLabel = (permission) => {
    return permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
                <Shield className="w-8 h-8 mr-4 text-teal-400" />
                Super Admin Dashboard
              </h1>
              <p className="text-neutral-400 mt-2 text-lg">Assign department heads and manage college administration</p>
              <div className="flex items-center space-x-2 mt-3">
                <Building2 className="w-4 h-4 text-neutral-500" />
                <span className="text-neutral-500">{currentCollege}</span>
              </div>
              <div className="flex items-center space-x-6 mt-4 text-sm text-neutral-500">
                <span className="flex items-center">
                  <UserCog className="w-4 h-4 mr-1" />
                  {admins.length} Department Heads
                </span>
                <span className="flex items-center">
                  <Building2 className="w-4 h-4 mr-1" />
                  {departments.length} Departments
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
                    <h3 className="text-xl font-bold text-white flex items-center">
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
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
