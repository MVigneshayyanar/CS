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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
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
          <div className="bg-gradient-to-br from-teal-900/90 to-cyan-900/90 border border-teal-500/50 rounded-xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-teal-400 text-4xl mb-4">🔒</div>
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
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 rounded-lg text-white font-medium transition-colors flex items-center gap-2"
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

        {/* Enhanced Header Section */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Beaker className="w-6 h-6 text-teal-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {(labLanguage || 'EXPERIMENT').toUpperCase()}
              </h1>
              <span className="text-sm text-neutral-400">•</span>
              <span className="text-sm text-neutral-300">{experiment.title}</span>
            </div>
            <div className="flex items-center gap-4">
              {examMode && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Fullscreen Mode Active
                </div>
              )}

              <div className="text-xs text-neutral-500">
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
              <button
                onClick={handleExitExperiment}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/40 text-red-300 hover:text-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit
              </button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout */}
        <div className="flex-1 flex overflow-hidden">

          {/* Left Panel - Problem Statement */}
          <div className="w-1/2 h-full border-r border-neutral-800 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-600/20 rounded-lg">
                    <Code className="w-4 h-4 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Problem Statement</h3>
                </div>
              </div>


            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Problem Description */}
              <div className="bg-neutral-800/30 rounded-xl p-4">
                <pre className="whitespace-pre-wrap text-neutral-300 font-mono text-sm leading-relaxed">
                  {experiment.question}
                </pre>
              </div>

              {/* Sample Test Cases */}
              {experiment.testCases && experiment.testCases.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-400" />
                    Sample Test Cases
                  </h4>
                  <div className="space-y-3">
                    {experiment.testCases.map((testCase, index) => (
                      <div key={index} className="bg-gradient-to-r from-teal-900/20 to-teal-800/20 border border-teal-700/30 rounded-xl p-4">
                        <div className="mb-2">
                          <span className="text-neutral-400 text-sm font-medium">Input:</span>
                          <pre className="text-teal-300 font-mono text-sm mt-1 bg-neutral-800/50 p-2 rounded">
                            {testCase.input}
                          </pre>
                        </div>
                        <div>
                          <span className="text-neutral-400 text-sm font-medium">Expected Output:</span>
                          <pre className="text-emerald-300 font-mono text-sm mt-1 bg-neutral-800/50 p-2 rounded">
                            {testCase.expected || testCase.expectedOutput}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Fixed Bottom Stats */}
            <div className="mt-auto flex-shrink-0 px-4 py-3 border-t border-neutral-800 bg-[#16162A]/30">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-neutral-800/40 p-3 rounded-xl border border-neutral-800/50 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-bold text-amber-400 mb-0.5">{experiment.domain}</div>
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Faculty</div>
                </div>
                <div className="bg-neutral-800/40 p-3 rounded-xl border border-neutral-800/50 flex flex-col items-center justify-center text-center">
                  <div className="text-sm font-bold text-rose-400 mb-0.5">
                    {experiment.deadline ? new Date(experiment.deadline).toLocaleDateString('en-GB') : 'N/A'}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Deadline</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 h-full flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/20 rounded-lg">
                    <Code className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                  <div className="flex items-center gap-2">

                    <span className="text-xs text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded">
                      Auto-saves every 2s
                    </span>
                  </div>
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
