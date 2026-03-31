import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Code, Beaker, AlertTriangle, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchStudentLabs } from '@/services/studentService';
import JudgePage from '../../pages/JudgePage.jsx';

// Custom debounce hook for auto-save functionality
const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);

  const debouncedCallback = (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
};

// Default starter code per language
const getDefaultCode = (language) => {
  switch ((language || '').toLowerCase()) {
    case 'python':
      return `# Write your Python solution here\n\n`;
    case 'java':
      return `public class Main {\n  public static void main(String[] args) {\n    // Write your Java solution here\n  }\n}`;
    case 'c':
      return `#include <stdio.h>\n\nint main() {\n    // Write your C solution here\n    return 0;\n}`;
    case 'c++':
    case 'cpp':
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your C++ solution here\n    return 0;\n}`;
    case 'javascript':
      return `// Write your JavaScript solution here\n\n`;
    default:
      return `// Write your solution here\n\n`;
  }
};

// Map lab language string to JudgePage language key
const mapLanguageKey = (lang) => {
  const l = (lang || '').toLowerCase();
  if (l === 'c++') return 'cpp';
  if (['python', 'java', 'c', 'cpp', 'javascript'].includes(l)) return l;
  return 'python'; // fallback
};

const ExperimentView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const experimentId = searchParams.get('id'); // format: "<labId>-<index>"

  // Experiment data from backend
  const [experiment, setExperiment] = useState(null);
  const [labLanguage, setLabLanguage] = useState('python');
  const [isLoadingExp, setIsLoadingExp] = useState(true);
  const [labId, setLabId] = useState(null);
  const [experimentIndex, setExperimentIndex] = useState(null);

  // Enhanced anti-cheat state management
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [hasFocus, setHasFocus] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [cheatAttempts, setCheatAttempts] = useState(0);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [examMode, setExamMode] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Auto-save state
  const [code, setCode] = useState('');
  const [lastSaved, setLastSaved] = useState(new Date());

  // Fetch the actual experiment from backend based on URL id
  useEffect(() => {
    const loadExperiment = async () => {
      try {
        setIsLoadingExp(true);
        const result = await fetchStudentLabs();
        const labs = result?.data?.labs || [];

        let foundExperiment = null;
        let foundLanguage = 'python';

        for (const lab of labs) {
          const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
          for (let i = 0; i < experiments.length; i++) {
            const expId = `${lab.id}-${i}`;
            if (expId === experimentId) {
              foundExperiment = {
                ...experiments[i],
                id: expId,
                sno: i + 1,
                title: experiments[i].title || `Experiment ${i + 1}`,
                domain: experiments[i].domain || lab.originalName || lab.fullName || lab.name || 'General',
                description: experiments[i].description || 'No description available',
                difficulty: experiments[i].difficulty || 'Intermediate',
                estimatedTime: experiments[i].estimatedTime || '3 hours',
                language: lab.language || lab.name || 'Python',
                question: experiments[i].description || experiments[i].question || 'Complete the experiment as described.',
                testCases: Array.isArray(experiments[i].testCases) ? experiments[i].testCases : [],
                deadline: experiments[i].deadline || experiments[i].availableTo || lab.created_at || new Date().toISOString(),
              };
              foundLanguage = lab.language || lab.name || 'python';
              setLabId(lab.id);
              setExperimentIndex(i);
              break;
            }
          }
          if (foundExperiment) break;
        }

        if (foundExperiment) {
          setExperiment(foundExperiment);
          setLabLanguage(foundLanguage);

          const savedCode = localStorage.getItem(`experiment_${experimentId}_code`);
          if (savedCode) {
            setCode(savedCode);
          } else {
            setCode(getDefaultCode(foundLanguage));
          }
        } else {
          setExperiment({
            id: experimentId,
            sno: 1,
            title: 'Experiment Not Found',
            domain: 'Unknown',
            description: 'This experiment could not be loaded. Please go back and try again.',
            difficulty: 'N/A',
            estimatedTime: 'N/A',
            language: 'python',
            question: 'Experiment data could not be loaded.',
            testCases: [],
          });
        }
      } catch (error) {
        console.error('Failed to load experiment:', error);
        setExperiment({
          id: experimentId,
          sno: 1,
          title: 'Error Loading Experiment',
          domain: 'Unknown',
          description: 'Failed to load experiment data from the server.',
          difficulty: 'N/A',
          estimatedTime: 'N/A',
          language: 'python',
          question: 'Failed to load experiment data. Please try again.',
          testCases: [],
        });
      } finally {
        setIsLoadingExp(false);
      }
    };

    if (experimentId) {
      loadExperiment();
    }
  }, [experimentId]);

  // Auto-save functionality with debounce
  const debouncedSave = useDebounce((codeToSave) => {
    setLastSaved(new Date());
    localStorage.setItem(`experiment_${experimentId}_code`, codeToSave);
  }, 2000);

  // Handle code changes
  const handleCodeChange = (newCode) => {
    setCode(newCode);
    debouncedSave(newCode);
  };

  // Enhanced cheat detection and logging system
  const logCheatAttempt = (type, details = '') => {
    const newAttempts = cheatAttempts + 1;
    setCheatAttempts(newAttempts);

    const cheatLog = {
      type,
      details,
      timestamp: new Date().toISOString(),
      attemptNumber: newAttempts,
      experimentId
    };

    console.warn('🚨 CHEAT ATTEMPT DETECTED:', cheatLog);

    const existingLogs = JSON.parse(localStorage.getItem('cheat_attempts') || '[]');
    existingLogs.push(cheatLog);
    localStorage.setItem('cheat_attempts', JSON.stringify(existingLogs));

    setWarningMessage(`Violation detected: ${type}. Attempt #${newAttempts}`);
    setShowCheatWarning(true);

    setTimeout(() => setShowCheatWarning(false), 4000);

    if (newAttempts >= 3) {
      handleSevereViolation(type);
    }
  };

  const handleSevereViolation = (_type) => {
    setWarningMessage(`Multiple violations detected. Session may be terminated.`);
    setShowViolationWarning(true);
  };

  // Enhanced fullscreen management
  const checkFullscreenStatus = () => {
    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.msFullscreenElement
    );
    setIsFullscreen(isCurrentlyFullscreen);
    return isCurrentlyFullscreen;
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    setExamMode(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setExamMode(false);
  };

  // Comprehensive anti-cheat event listeners
  useEffect(() => {
    const handleFocus = () => {
      setHasFocus(true);
    };

    const handleBlur = () => {
      setHasFocus(false);
      if (examMode) {
        logCheatAttempt('window_focus_lost', 'User switched to another application');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        if (examMode) {
          logCheatAttempt('tab_switch', 'User switched browser tabs or minimized window');
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examMode]);

  // Enhanced keyboard event prevention
  useEffect(() => {
    const preventContextMenu = (e) => {
      if (examMode) {
        e.preventDefault();
        logCheatAttempt('right_click', 'Attempted to open context menu');
      }
    };

    const preventKeyShortcuts = (e) => {
      if (!examMode) return;

      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        logCheatAttempt('escape_key', 'Attempted to exit fullscreen using ESC key');
        return false;
      }

      if (e.key === 'F11' || e.keyCode === 122) {
        e.preventDefault();
        e.stopPropagation();
        logCheatAttempt('f11_key', 'Attempted to toggle fullscreen using F11');
        return false;
      }

      if (
        (e.ctrlKey && ['c', 'v', 'x', 'a', 't', 'n', 'w', 's', 'r'].includes(e.key.toLowerCase())) ||
        (e.altKey && e.key === 'Tab') ||
        (e.metaKey && e.key === 'Tab') ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
        (e.ctrlKey && e.key.toLowerCase() === 'u') ||
        (e.key === 'F5') ||
        (e.ctrlKey && e.key === 'F5')
      ) {
        e.preventDefault();
        e.stopPropagation();
        logCheatAttempt('keyboard_shortcut', `Blocked shortcut: ${e.ctrlKey ? 'Ctrl+' : ''}${e.altKey ? 'Alt+' : ''}${e.shiftKey ? 'Shift+' : ''}${e.key}`);
        return false;
      }
    };

    const preventSelection = (e) => {
      if (examMode && !e.target.closest('.monaco-editor')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventContextMenu, { capture: true });
    document.addEventListener('keydown', preventKeyShortcuts, { capture: true });
    document.addEventListener('keyup', preventKeyShortcuts, { capture: true });
    document.addEventListener('selectstart', preventSelection, { capture: true });

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu, { capture: true });
      document.removeEventListener('keydown', preventKeyShortcuts, { capture: true });
      document.removeEventListener('keyup', preventKeyShortcuts, { capture: true });
      document.removeEventListener('selectstart', preventSelection, { capture: true });
    };
  }, [examMode]);

  // Monitor fullscreen changes with violation detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      const currentFullscreenStatus = checkFullscreenStatus();

      if (!currentFullscreenStatus && examMode) {
        logCheatAttempt('fullscreen_exit', 'Exited fullscreen mode');
        setShowExitWarning(true);

        setTimeout(() => {
          if (examMode) {
            enterFullscreen();
          }
        }, 1000);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [examMode]);

  // Auto-detect screen size and prompt for fullscreen
  useEffect(() => {
    const currentFullscreenStatus = checkFullscreenStatus();

    if (!currentFullscreenStatus && !examMode) {
      setShowExitWarning(true);
    } else {
      setShowExitWarning(false);
    }
  }, [examMode]);

  // Handle exit experiment
  const handleExitExperiment = () => {
    setExamMode(false);
    if (isFullscreen) {
      exitFullscreen();
    }
    setTimeout(() => {
      // Return to the particular lab's experiment list instead of all experiments
      const returnUrl = labId ? `/labs/experiments?labId=${labId}` : '/labs/experiments';
      navigate(returnUrl);
    }, 100);
  };

  // Loading state
  if (isLoadingExp) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3aa892] mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading experiment...</p>
        </div>
      </div>
    );
  }

  if (!experiment) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white overflow-hidden">

      {/* Cheat Warning System */}
      {showCheatWarning && (
        <div className="fixed top-4 right-4 z-[10001] max-w-sm">
          <div className="bg-red-600/90 border-2 border-red-400 rounded-lg p-4 shadow-2xl animate-pulse">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-red-200" />
              <div>
                <h4 className="font-bold text-white text-sm">Security Alert</h4>
                <p className="text-red-100 text-xs mt-1">{warningMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Severe Violation Warning */}
      {showViolationWarning && (
        <div className="fixed inset-0 bg-red-900 bg-opacity-95 flex flex-col items-center justify-center z-[10000]">
          <div className="bg-red-800 border-2 border-red-400 rounded-xl p-8 max-w-lg text-center">
            <AlertTriangle className="w-20 h-20 text-red-300 mx-auto mb-6 animate-pulse" />
            <h3 className="text-3xl font-bold text-white mb-4">⚠️ MULTIPLE VIOLATIONS DETECTED</h3>
            <p className="text-red-100 text-lg mb-4">
              You have attempted to violate integrity rules multiple times.
            </p>
            <p className="text-red-200 mb-6">
              All activities are being logged. Continue following guidelines.
            </p>
            <div className="bg-red-700/50 rounded-lg p-4 mb-4">
              <p className="text-red-100 text-sm">📋 Total violations: {cheatAttempts}</p>
              <p className="text-red-100 text-sm">🔍 All actions are monitored and recorded</p>
            </div>
            <button
              onClick={() => setShowViolationWarning(false)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold transition-colors"
            >
              I UNDERSTAND - CONTINUE
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Fullscreen Prompt */}
      {!isFullscreen && showExitWarning && !showViolationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[10000]">
          <div className="bg-gradient-to-br from-teal-900/90 to-teal-900/90 border border-[#2a8c78]/50 rounded-xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-[#3aa892] text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-4">Fullscreen Mode Required</h3>
            <p className="text-teal-100 mb-6">
              You must enter and remain in fullscreen mode throughout the experiment.
            </p>
            <div className="bg-teal-800/30 rounded-lg p-4 mb-6">
              <p className="text-teal-200 text-sm mb-2">📋 **Strict Rules:**</p>
              <ul className="text-teal-200 text-sm text-left space-y-1">
                <li>• Must stay in fullscreen mode</li>
                <li>• ESC key is disabled</li>
                <li>• No window switching allowed</li>
                <li>• No copy-paste operations</li>
                <li>• All violations are logged</li>
                <li>• Auto-save enabled</li>
              </ul>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  enterFullscreen();
                  setShowExitWarning(false);
                }}
                className="px-6 py-3 bg-[#1a6b5c] hover:bg-[#134d42] rounded-lg text-white font-medium transition-colors flex items-center gap-2"
              >
                <Beaker className="w-4 h-4" />
                Enter Fullscreen Mode
              </button>
              <button
                onClick={handleExitExperiment}
                className="px-4 py-3 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white font-medium flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-full flex flex-col">

        {/* v2 Premium Header Section */}
        <div className="flex-shrink-0 px-8 py-5 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#1a6b5c] flex items-center justify-center shadow-lg shadow-teal-900/40">
                 <Beaker className="w-5 h-5 text-teal-200" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 mb-0.5">
                  {(labLanguage || 'EXPERIMENT').toUpperCase()}
                  <span className="text-teal-500/50">/</span>
                  <span className="opacity-70">Task 0{experiment.sno}</span>
                </h1>
                <p className="text-[11px] font-bold text-teal-100/40 uppercase tracking-widest">{experiment.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {examMode && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#3aa892] text-[10px] font-black uppercase tracking-[0.1em] shadow-sm shadow-emerald-900/5">
                  <div className="w-1.5 h-1.5 bg-[#3aa892] rounded-full animate-pulse shadow-[0_0_8px_#3aa892]"></div>
                  Integrity Guard Active
                </div>
              )}

              <div className="py-2 px-3 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-neutral-500 uppercase tracking-tighter">
                Synched: {lastSaved.toLocaleTimeString()}
              </div>

              <button
                onClick={handleExitExperiment}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600/30 text-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Terminate Session
              </button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Panel - Problem Statement */}
          <div className="w-1/2 h-full border-r border-white/5 flex flex-col overflow-hidden bg-neutral-900/20">
            <div className="flex-shrink-0 px-8 py-5 border-b border-white/5 bg-neutral-950/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
                    <Code className="w-4 h-4 text-[#3aa892]" />
                  </div>
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-80">Experiment Specifications</h3>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
              {/* Problem Description */}
              <div className="bg-neutral-800/20 border border-white/5 rounded-2xl p-6 shadow-sm">
                <pre className="whitespace-pre-wrap text-teal-50/80 font-mono text-[13px] leading-relaxed selection:bg-teal-500/20">
                  {experiment.question}
                </pre>
              </div>

              {/* Sample Test Cases */}
              {experiment.testCases && experiment.testCases.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-[#3aa892] uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    Validation Blueprints
                  </h4>
                  <div className="space-y-4">
                    {experiment.testCases.map((testCase, index) => (
                      <div key={index} className="bg-white/5 border border-white/5 rounded-2xl p-6 hover:border-teal-500/20 transition-all">
                        <div className="grid grid-cols-2 gap-8">
                           <div>
                              <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3">Input Pattern</p>
                              <pre className="text-teal-400 font-mono text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                                {testCase.input}
                              </pre>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-3">Expected Result</p>
                              <pre className="text-amber-400 font-mono text-xs bg-black/40 p-3 rounded-xl border border-white/5">
                                {testCase.expected || testCase.expectedOutput}
                              </pre>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Metadata */}
            <div className="mt-auto px-8 py-4 border-t border-white/5 bg-neutral-950/40">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center group hover:border-teal-500/20 transition-all">
                   <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Assigned Domain</p>
                   <p className="text-[11px] font-black text-teal-400 uppercase tracking-tight">{experiment.domain}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center group hover:border-rose-500/20 transition-all">
                   <p className="text-[8px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Submission Deadline</p>
                   <p className="text-[11px] font-black text-rose-400 uppercase tracking-tight">
                     {experiment.deadline ? new Date(experiment.deadline).toLocaleDateString('en-GB') : 'N/A'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 h-full flex flex-col overflow-hidden bg-neutral-950">
            <div className="flex-shrink-0 px-8 py-5 border-b border-white/5 bg-neutral-950/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-500/10 rounded-lg flex items-center justify-center">
                      <Code className="w-4 h-4 text-[#3aa892]" />
                    </div>
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] opacity-80">Development Environment</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-neutral-500 bg-white/5 px-2 py-1 rounded-md uppercase tracking-widest border border-white/5">
                      PERSISTENCE ENGINE: 2.0s
                    </span>
                  </div>
                </div>
            </div>

            {/* Judge Page Integration - pass the correct language */}
            <div className="flex-1 flex flex-col min-h-0 m-2 rounded-xl overflow-hidden">
              <JudgePage
                initialLanguage={mapLanguageKey(labLanguage)}
                initialCode={code}
                onCodeChange={handleCodeChange}
                testCases={experiment.testCases}
                labId={labId}
                experimentIndex={experimentIndex}
                onAutoExit={handleExitExperiment}
                onComplete={() => {
                  // Reload experiment data from server to reflect the new status
                  // Using experimentId from closures
                  const reload = async () => {
                    const result = await fetchStudentLabs();
                    const labs = result?.data?.labs || [];
                    for (const lab of labs) {
                      const experiments = Array.isArray(lab.experiments) ? lab.experiments : [];
                      for (let i = 0; i < experiments.length; i++) {
                        if (`${lab.id}-${i}` === experimentId) {
                          setExperiment({
                            ...experiments[i],
                            id: `${lab.id}-${i}`,
                            sno: i + 1,
                            title: experiments[i].title || `Experiment ${i + 1}`,
                            domain: experiments[i].domain || lab.originalName || lab.fullName || lab.name || 'General',
                            description: experiments[i].description || 'No description available',
                            difficulty: experiments[i].difficulty || 'Intermediate',
                            estimatedTime: experiments[i].estimatedTime || '3 hours',
                            language: lab.language || lab.name || 'Python',
                            question: experiments[i].description || experiments[i].question || 'Complete the experiment as described.',
                            testCases: Array.isArray(experiments[i].testCases) ? experiments[i].testCases : [],
                            deadline: experiments[i].deadline || experiments[i].availableTo || lab.created_at || new Date().toISOString(),
                          });
                          break;
                        }
                      }
                    }
                  }
                  reload();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentView;
