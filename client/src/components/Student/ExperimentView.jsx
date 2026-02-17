import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Clock, Code, Beaker, AlertTriangle, Shield } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

const ExperimentView = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const experimentId = searchParams.get('id');
  
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
  const [code, setCode] = useState(`# Write your Python solution here
def factorial(n):
    """
    Calculate the factorial of a number
    Args:
        n (int): A non-negative integer
    Returns:
        int: The factorial of n
    """
    if n < 0:
        return None  # or raise ValueError("Factorial is not defined for negative numbers")
    elif n == 0 or n == 1:
        return 1
    else:
        result = 1
        for i in range(2, n + 1):
            result *= i
        return result

# Test your function
print("Testing factorial function:")
print(f"factorial(5) = {factorial(5)}")
print(f"factorial(0) = {factorial(0)}")
print(f"factorial(3) = {factorial(3)}")
print(f"factorial(1) = {factorial(1)}")`);
  
  const [lastSaved, setLastSaved] = useState(new Date());

  // Auto-save functionality with debounce
  const debouncedSave = useDebounce((codeToSave) => {
    console.log('Auto-saving code:', codeToSave);
    setLastSaved(new Date());
    localStorage.setItem(`experiment_${experimentId}_code`, codeToSave);
  }, 2000);

  // Load saved code on component mount
  useEffect(() => {
    const savedCode = localStorage.getItem(`experiment_${experimentId}_code`);
    if (savedCode) {
      setCode(savedCode);
    }
  }, [experimentId]);

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
    
    // Store cheat attempts in localStorage for reporting
    const existingLogs = JSON.parse(localStorage.getItem('cheat_attempts') || '[]');
    existingLogs.push(cheatLog);
    localStorage.setItem('cheat_attempts', JSON.stringify(existingLogs));
    
    // Show warning
    setWarningMessage(`Violation detected: ${type}. Attempt #${newAttempts}`);
    setShowCheatWarning(true);
    
    // Auto-hide warning after 4 seconds
    setTimeout(() => setShowCheatWarning(false), 4000);
    
    // Escalate after multiple attempts
    if (newAttempts >= 3) {
      handleSevereViolation(type);
    }
  };

  // Handle severe violations (3+ attempts) - Fixed semicolon issue
  const handleSevereViolation = (type) => {
    setWarningMessage(`Multiple violations detected. Exam may be terminated.`);
    setShowViolationWarning(true);
    
    // Optional: You can implement automatic exam termination here
    // setTimeout(() => {
    //   if (isFullscreen) exitFullscreen();
    //   navigate('/labs/experiments');
    // }, 5000);
  };

  // Experiment data
  const getExperimentData = (id) => {
    const allExperiments = {
      1: {
        id: 1,
        sno: 1,
        title: 'Python Function Basics - Factorial Calculator',
        domain: 'Python Programming',
        description: 'Learn Python function basics by implementing a factorial calculator with proper error handling.',
        difficulty: 'Beginner',
        estimatedTime: '2 hours',
        language: 'python',
        question: `# Python Function Basics - Factorial Calculator

## Problem Statement
Write a Python function to calculate the factorial of a given number.

## Requirements
1. **Function Definition**: Define a function called \`factorial(n)\` that:
   - Takes one parameter \`n\` (integer)
   - Returns the factorial of \`n\` (n!)
   - Handles edge cases properly

2. **Mathematical Definition**:
   - \`n! = n × (n-1) × (n-2) × ... × 2 × 1\`
   - \`0! = 1\` (by mathematical convention)
   - \`1! = 1\`

3. **Edge Cases to Handle**:
   - Factorial of 0 should return 1
   - Factorial of negative numbers should return \`None\` or raise an appropriate error
   - Handle only integer inputs

## Examples
- \`factorial(5)\` should return \`120\` (5 × 4 × 3 × 2 × 1)
- \`factorial(0)\` should return \`1\`
- \`factorial(1)\` should return \`1\`
- \`factorial(3)\` should return \`6\`

## Implementation Approaches
You can use either:
1. **Iterative approach**: Use a for loop to multiply numbers
2. **Recursive approach**: Function calls itself

## Test Your Solution
Make sure your function works correctly with all the test cases provided.

## Tips
- Start with the base cases (0 and 1)
- Use a loop from 2 to n for the iterative approach
- Remember to handle negative numbers appropriately`,
        testCases: [
          { input: "factorial(5)", expected: "120" },
          { input: "factorial(0)", expected: "1" },
          { input: "factorial(3)", expected: "6" },
          { input: "factorial(1)", expected: "1" }
        ]
      }
    };
    
    return allExperiments[id] || allExperiments[1];
  };

  const experiment = getExperimentData(parseInt(experimentId));

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

      // Prevent ESC key - Critical for exam integrity
      if (e.key === 'Escape' || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();
        logCheatAttempt('escape_key', 'Attempted to exit fullscreen using ESC key');
        return false;
      }

      // Prevent F11 key
      if (e.key === 'F11' || e.keyCode === 122) {
        e.preventDefault();
        e.stopPropagation();
        logCheatAttempt('f11_key', 'Attempted to toggle fullscreen using F11');
        return false;
      }

      // Prevent other dangerous shortcuts
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

    // Prevent selection of text outside code editor
    const preventSelection = (e) => {
      if (examMode && !e.target.closest('.monaco-editor')) {
        e.preventDefault();
        return false;
      }
    };

    // Add all event listeners with high priority
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
        // User exited fullscreen during exam
        logCheatAttempt('fullscreen_exit', 'Exited fullscreen mode during exam');
        setShowExitWarning(true);
        
        // Force back to fullscreen after a short delay
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

  // Handle exit experiment - properly exit fullscreen first
  const handleExitExperiment = () => {
    setExamMode(false);
    if (isFullscreen) {
      exitFullscreen();
    }
    setTimeout(() => {
      navigate('/labs/experiments');
    }, 100);
  };

  // Handle violation - but don't automatically terminate
  const handleViolation = () => {
    logCheatAttempt('manual_violation', 'Manual violation triggered');
  };

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
              You have attempted to violate exam integrity rules multiple times.
            </p>
            <p className="text-red-200 mb-6">
              All activities are being logged. Continue following exam guidelines.
            </p>
            <div className="bg-red-700/50 rounded-lg p-4 mb-4">
              <p className="text-red-100 text-sm">📋 Total violations: {cheatAttempts}</p>
              <p className="text-red-100 text-sm">🔍 All actions are monitored and recorded</p>
            </div>
            <button
              onClick={() => setShowViolationWarning(false)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold transition-colors"
            >
              I UNDERSTAND - CONTINUE EXAM
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Fullscreen Prompt */}
      {!isFullscreen && showExitWarning && !showViolationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-[10000]">
          <div className="bg-gradient-to-br from-teal-900/90 to-cyan-900/90 border border-teal-500/50 rounded-xl p-8 max-w-md text-center shadow-2xl">
            <div className="text-teal-400 text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-white mb-4">Secure Exam Mode Required</h3>
            <p className="text-teal-100 mb-6">
              For exam integrity, you must enter and remain in fullscreen mode throughout the experiment.
            </p>
            <div className="bg-teal-800/30 rounded-lg p-4 mb-6">
              <p className="text-teal-200 text-sm mb-2">📋 **Strict Exam Rules:**</p>
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
                Enter Secure Exam Mode
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
                PYTHON EXPERIMENT
              </h1>
              <span className="text-sm text-neutral-400">•</span>
              <span className="text-sm text-neutral-300">{experiment.title}</span>
            </div>
            <div className="flex items-center gap-4">
              {examMode && (
                <div className="flex items-center gap-2 text-green-400 text-xs">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Secure Exam Mode Active
                </div>
              )}
              {cheatAttempts > 0 && (
                <div className="flex items-center gap-2 text-red-400 text-xs">
                  <Shield className="w-3 h-3" />
                  Violations: {cheatAttempts}
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
                Exit Exam
              </button>
            </div>
          </div>
        </div>

        {/* Split Screen Layout - Unchanged */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Panel - Problem Statement */}
          <div className="w-1/2 border-r border-neutral-800 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-600/20 rounded-lg">
                    <Code className="w-4 h-4 text-teal-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Problem Statement</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  experiment.difficulty === 'Beginner' 
                    ? 'bg-green-600/20 text-green-400 border border-green-500/30' 
                    : experiment.difficulty === 'Intermediate'
                    ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-red-600/20 text-red-400 border border-red-500/30'
                }`}>
                  {experiment.difficulty}
                </span>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-neutral-800/40 p-2 rounded-lg text-center">
                  <div className="text-sm font-semibold text-teal-400">{experiment.difficulty}</div>
                  <div className="text-xs text-neutral-400">Difficulty</div>
                </div>
                <div className="bg-neutral-800/40 p-2 rounded-lg text-center">
                  <div className="text-sm font-semibold text-emerald-400">{experiment.estimatedTime}</div>
                  <div className="text-xs text-neutral-400">Est. Time</div>
                </div>
                <div className="bg-neutral-800/40 p-2 rounded-lg text-center">
                  <div className="text-sm font-semibold text-amber-400">{experiment.domain}</div>
                  <div className="text-xs text-neutral-400">Domain</div>
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
                            {testCase.expected}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code Editor */}
          <div className="w-1/2 flex flex-col overflow-hidden">
            <div className="flex-shrink-0 p-4 border-b border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600/20 rounded-lg">
                    <Code className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      Python Environment
                    </span>
                    {examMode && (
                      <span className="text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded border border-red-500/20">
                        🔒 Protected Mode
                      </span>
                    )}
                    <span className="text-xs text-neutral-500 bg-neutral-800/50 px-2 py-1 rounded">
                      Auto-saves every 2s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Judge Page Integration */}
            <div className="flex-1 bg-neutral-800/30 m-4 rounded-xl overflow-hidden">
              <JudgePage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentView;
