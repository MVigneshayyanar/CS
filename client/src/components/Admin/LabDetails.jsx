import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminLabs, updateAdminLab } from '@/services/adminService';
import { ArrowLeft, Plus, FlaskConical, Users, BookOpen, Trash2 } from 'lucide-react';

const LabDetails = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const { data } = await fetchAdminLabs();
        const foundLab = (data?.labs || []).find(l => String(l.id) === String(labId));
        if (foundLab) {
          // Normalize
          setLab({
            ...foundLab,
            experiments: Array.isArray(foundLab.experiments) ? foundLab.experiments : [],
            students: Array.isArray(foundLab.students) ? foundLab.students : []
          });
        }
      } catch (err) {
        console.error("Failed to load lab details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLab();
  }, [labId]);

  const handleDeleteExperiment = async (expId) => {
    if (!lab) return;
    if (!window.confirm("Are you sure you want to delete this experiment?")) return;
    
    setIsUpdating(true);
    const updatedExperiments = lab.experiments.filter(e => e.id !== expId);
    try {
      await updateAdminLab(lab.id, { ...lab, experiments: updatedExperiments });
      setLab({ ...lab, experiments: updatedExperiments });
    } catch (err) {
      alert("Failed to remove experiment");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="p-8 text-neutral-400 animate-pulse flex items-center">Loading lab details...</div>;
  if (!lab) return <div className="p-8 text-red-400">Lab not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button onClick={() => navigate('/labs')} className="mr-4 p-2.5 text-neutral-400 hover:text-white bg-neutral-800/80 rounded-xl transition-all hover:bg-neutral-700">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
              {lab.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-400 font-medium border border-purple-500/20">
                {lab.language}
              </span>
              <span className="flex items-center text-neutral-400 bg-neutral-800/50 px-2 py-0.5 rounded-md">
                <Users className="w-3.5 h-3.5 mr-1.5" /> {lab.students.length} Students
              </span>
              <span className="flex items-center text-neutral-400 bg-neutral-800/50 px-2 py-0.5 rounded-md">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> {lab.faculty || "No Faculty"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate(`/labs/${labId}/experiments/create`)}
          className="bg-teal-500 hover:bg-teal-400 text-black font-bold px-6 py-3 rounded-xl transition-all flex items-center shadow-[0_0_15px_rgba(20,184,166,0.3)] shadow-teal-500/20"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Experiment
        </button>
      </div>

      <div className="bg-[#121214] border border-neutral-800 rounded-3xl p-6 md:p-10 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center border-b border-neutral-800 pb-4">
          <FlaskConical className="w-5 h-5 mr-3 text-teal-500" />
          Experiments ({lab.experiments.length})
        </h2>

        {lab.experiments.length === 0 ? (
          <div className="text-center py-20 px-6 rounded-2xl bg-gradient-to-b from-neutral-900/50 to-transparent border border-dashed border-neutral-800 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-neutral-800/80 rounded-full flex items-center justify-center mb-4 border border-neutral-700/50">
              <FlaskConical className="w-8 h-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium text-neutral-300 mb-2">No experiments found</h3>
            <p className="text-neutral-500 max-w-sm text-sm">Create the first experiment for this lab to get started with coding exercises.</p>
            <button onClick={() => navigate(`/labs/${labId}/experiments/create`)} className="mt-6 text-teal-400 hover:text-teal-300 font-medium text-sm flex items-center bg-teal-500/10 px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4 mr-1" /> Create Experiment
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {lab.experiments.map((exp, index) => (
              <div key={exp.id || index} className="group relative bg-[#1c1c1f] hover:bg-[#232326] border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-6 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-6">
                    <div className="flex items-center gap-3 mb-2">
                       <span className="bg-teal-500/10 text-teal-400 text-xs font-bold px-2.5 py-1 rounded-md mb-1 inline-block border border-teal-500/20 uppercase tracking-widest">
                         EXP #{index + 1}
                       </span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-100 mb-3 group-hover:text-teal-400 transition-colors">{exp.title}</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed mb-6">{exp.description}</p>
                    
                    <div className="bg-black/40 rounded-xl p-4 border border-black/50">
                      <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Test Cases ({exp.testCases?.length || 0})</h4>
                      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {(exp.testCases || []).slice(0, 3).map((tc, tcIdx) => (
                          <div key={tcIdx} className="bg-neutral-900/80 p-3 rounded-lg border border-neutral-800 text-xs font-mono">
                            <div className="mb-1.5"><span className="text-neutral-600 mr-2">IN:</span> <span className="text-teal-300/80">{tc.input || 'empty'}</span></div>
                            <div><span className="text-neutral-600 mr-2">OUT:</span> <span className="text-blue-300/80">{tc.expectedOutput || 'empty'}</span></div>
                          </div>
                        ))}
                        {(exp.testCases?.length || 0) > 3 && (
                          <div className="flex items-center justify-center bg-neutral-900/40 p-3 rounded-lg border border-neutral-800 text-xs text-neutral-500 font-medium">
                            +{exp.testCases.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteExperiment(exp.id)}
                      disabled={isUpdating}
                      className="p-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      title="Delete Experiment"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
      `}} />
    </div>
  );
};

export default LabDetails;
