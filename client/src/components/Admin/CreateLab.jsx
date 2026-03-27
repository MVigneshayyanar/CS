import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, FlaskConical, Users, BookOpen } from 'lucide-react';
import {
  fetchAdminFaculty,
  fetchAdminStudents,
  createAdminLab,
} from '@/services/adminService';

const CreateLab = () => {
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [labForm, setLabForm] = useState({
    name: '',
    language: '',
    faculty: [],
    students: [],
    experiments: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facultyResult, studentsResult] = await Promise.all([
          fetchAdminFaculty(),
          fetchAdminStudents(),
        ]);
        setFaculty(facultyResult?.data?.faculty || []);
        setStudents(studentsResult?.data?.students || []);
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Backend expects a string or array? Previously it was string for faculty, now array.
      // Let's assume we pass array for faculty or join as string. We'll join as string if needed, 
      // but let's send array or comma-separated. The previous code was single string. 
      // "slect n number faculty" -> Let's join by comma for now to avoid backend changes if it's text.
      const payload = {
        ...labForm,
        faculty: labForm.faculty.join(', '),
      };
      await createAdminLab(payload);
      navigate('/labs');
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to create lab');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAllFaculty = () => {
    if (labForm.faculty.length === faculty.length) {
      setLabForm({ ...labForm, faculty: [] });
    } else {
      setLabForm({ ...labForm, faculty: faculty.map(f => f.name) });
    }
  };

  const handleSelectAllStudents = () => {
    if (labForm.students.length === students.length) {
      setLabForm({ ...labForm, students: [] });
    } else {
      setLabForm({ ...labForm, students: students.map(s => s.name) });
    }
  };

  const toggleStudent = (name) => {
    if (labForm.students.includes(name)) {
      setLabForm({ ...labForm, students: labForm.students.filter(s => s !== name) });
    } else {
      setLabForm({ ...labForm, students: [...labForm.students, name] });
    }
  };

  const toggleFaculty = (name) => {
    if (labForm.faculty.includes(name)) {
      setLabForm({ ...labForm, faculty: labForm.faculty.filter(f => f !== name) });
    } else {
      setLabForm({ ...labForm, faculty: [...labForm.faculty, name] });
    }
  };

  if (isLoading) return <div className="p-8 text-neutral-400">Loading data...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center mb-8">
        <button onClick={() => navigate('/labs')} className="mr-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
            <FlaskConical className="w-8 h-8 mr-3 text-teal-400" />
            Create New Lab
          </h1>
          <p className="text-neutral-400 mt-2">Set up a new laboratory and assign members</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-700/50 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Lab Name</label>
              <input
                type="text"
                placeholder="E.g., Data Structures Lab"
                value={labForm.name}
                onChange={(e) => setLabForm({...labForm, name: e.target.value})}
                className="w-full p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Programming Language</label>
              <select
                value={labForm.language}
                onChange={(e) => setLabForm({...labForm, language: e.target.value})}
                className="w-full p-4 bg-neutral-800/50 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all"
                required
              >
                <option value="">Select Language</option>
                <option value="C">C Programming</option>
                <option value="C++">C++</option>
                <option value="Java">Java</option>
                <option value="Python">Python</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            {/* Faculty Selection */}
            <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
                  Assign Faculty
                </h3>
                <button
                  type="button"
                  onClick={handleSelectAllFaculty}
                  className="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
                >
                  {labForm.faculty.length === faculty.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {faculty.map(f => (
                  <label key={f.id} className="flex items-center space-x-3 p-3 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-neutral-600">
                    <input
                      type="checkbox"
                      checked={labForm.faculty.includes(f.name)}
                      onChange={() => toggleFaculty(f.name)}
                      className="w-4 h-4 rounded border-neutral-600 text-purple-500 focus:ring-purple-500 focus:ring-offset-neutral-800 bg-neutral-700"
                    />
                    <span className="text-sm text-neutral-200">{f.name} <span className="text-neutral-500 text-xs ml-1">({f.qualification})</span></span>
                  </label>
                ))}
                {faculty.length === 0 && <div className="text-neutral-500 text-sm text-center py-4">No faculty available</div>}
              </div>
            </div>

            {/* Students Selection */}
            <div className="bg-neutral-800/30 p-6 rounded-xl border border-neutral-700/50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-400" />
                  Assign Students
                </h3>
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="text-xs px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  {labForm.students.length === students.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {students.map(s => (
                  <label key={s.id} className="flex items-center space-x-3 p-3 bg-neutral-800/50 hover:bg-neutral-700/50 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-neutral-600">
                    <input
                      type="checkbox"
                      checked={labForm.students.includes(s.name)}
                      onChange={() => toggleStudent(s.name)}
                      className="w-4 h-4 rounded border-neutral-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-neutral-800 bg-neutral-700"
                    />
                    <span className="text-sm text-neutral-200">{s.name} <span className="text-neutral-500 text-xs ml-1">({s.rollNo})</span></span>
                  </label>
                ))}
                {students.length === 0 && <div className="text-neutral-500 text-sm text-center py-4">No students available</div>}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t border-neutral-800">
            <button
              type="submit"
              disabled={isSubmitting || !labForm.name || !labForm.language}
              className="px-8 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all flex items-center shadow-lg shadow-teal-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Creating Lab...' : 'Create Lab'}
            </button>
          </div>
        </form>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #404040; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #525252; }
      `}} />
    </div>
  );
};

export default CreateLab;
