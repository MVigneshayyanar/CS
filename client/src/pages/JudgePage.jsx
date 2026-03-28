import { useState, useRef, useEffect } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import { submitCode } from "../services/judgeService";
import CelebrationSplash from "../components/CelebrationSplash.jsx";
import {
  Play,
  Send,
  ChevronDown,
  Terminal,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Code2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { updateExperimentStatus } from "../services/studentService";

// Default starter code per language
const getStarterCode = (lang) => {
  switch (lang) {
    case "python":
      return `# Write your solution here\n\n`;
    case "java":
      return `public class Main {\n  public static void main(String[] args) {\n    // Write your solution here\n  }\n}`;
    case "c":
      return `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
    case "cpp":
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
    case "javascript":
      return `// Write your solution here\n\n`;
    default:
      return `// Write your solution here\n\n`;
  }
};

const LANGUAGES = [
  { value: "java", label: "Java", icon: "☕" },
  { value: "python", label: "Python 3", icon: "🐍" },
  { value: "cpp", label: "C++", icon: "⚡" },
  { value: "c", label: "C", icon: "🔧" },
  { value: "javascript", label: "JavaScript", icon: "🟨" },
];

const JudgePage = ({ initialLanguage, initialCode, experimentCode, onCodeChange, testCases, labId, experimentIndex, onComplete, onAutoExit, lockLanguage = true }) => {
  const defaultLang = initialLanguage || "java";
  
  // Filter languages if locked
  const availableLanguages = lockLanguage && initialLanguage 
    ? LANGUAGES.filter(l => l.value === mapLanguageKeyInternal(initialLanguage))
    : LANGUAGES;

  // Helper inside component for mapping just in case
  function mapLanguageKeyInternal(lang) {
    const l = (lang || "").toLowerCase();
    if (l === "c++") return "cpp";
    return l;
  }
  const startCode =
    initialCode || experimentCode || getStarterCode(defaultLang);

  const [language, setLanguage] = useState(defaultLang);
  const [code, setCode] = useState(startCode);
  const [savedCodes, setSavedCodes] = useState({
    [defaultLang]: startCode,
  });
  const [result, setResult] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("testcase"); // 'testcase' | 'result'
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [testResults, setTestResults] = useState([]); // Array of {passed, input, expected, actual, error}
  const [activeTestIdx, setActiveTestIdx] = useState(0);
  const [consoleExpanded, setConsoleExpanded] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const [consoleHeight, setConsoleHeight] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const outputRef = useRef(null);
  const dropdownRef = useRef(null);
  const resizerRef = useRef(null);

  const startResizing = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e) => {
    if (isResizing) {
      const newHeight = window.innerHeight - e.clientY - 40; // adjusting for a bit of margin
      if (newHeight > 100 && newHeight < window.innerHeight * 0.8) {
        setConsoleHeight(newHeight);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  const currentLang = LANGUAGES.find((l) => l.value === language) || LANGUAGES[0];

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setShowLangDropdown(false);
    const newCode =
      savedCodes[newLang] !== undefined
        ? savedCodes[newLang]
        : getStarterCode(newLang);
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  const handleEditorChange = (val) => {
    setCode(val);
    setSavedCodes((prev) => ({ ...prev, [language]: val }));
    if (onCodeChange) onCodeChange(val);
  };

  const handleReset = () => {
    const starterCode = getStarterCode(language);
    setCode(starterCode);
    setSavedCodes((prev) => ({ ...prev, [language]: starterCode }));
    if (onCodeChange) onCodeChange(starterCode);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setActiveTab("result");
    setTestResults([]);

    try {
      if (!testCases || testCases.length === 0) {
        const data = await submitCode(code, language);
        setResult(data.output || data.error || "No output");
        setTestResults([
          {
            passed: null,
            input: "",
            expected: "",
            actual: data.output || data.error || "No output",
            error: data.error || null,
          },
        ]);
      } else {
        const results = [];
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          const stdin = tc.input || "";
          const expected = (tc.expected || tc.expectedOutput || "").trim();
          const data = await submitCode(code, language, stdin);

          if (data.error) {
            results.push({
              passed: false,
              input: stdin,
              expected,
              actual: data.error,
              error: data.error,
            });
          } else {
            const actualOutput = (data.output || "").trim();
            results.push({
              passed: expected ? actualOutput === expected : null,
              input: stdin,
              expected,
              actual: actualOutput,
              error: null,
            });
          }
        }
        setTestResults(results);
        setActiveTestIdx(0);

        const allPassed = results.every((r) => r.passed === true);
        const someFailed = results.some((r) => r.passed === false);
        if (allPassed) {
          setResult("🎉 All test cases passed!");
        } else if (someFailed) {
          setResult("⚠️ Some test cases failed.");
        } else {
          setResult("Code executed successfully.");
        }
      }
    } catch (error) {
      setResult("Server Error: " + error.message);
      setTestResults([
        {
          passed: false,
          input: "",
          expected: "",
          actual: "Server Error: " + error.message,
          error: error.message,
        },
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setActiveTab("result");
    setTestResults([]);

    try {
      if (!testCases || testCases.length === 0) {
        const data = await submitCode(code, language);
        setResult(
          "✅ Submission Successful:\n" +
            (data.output || data.error || "No output")
        );
        setTestResults([
          {
            passed: null,
            input: "",
            expected: "",
            actual: data.output || data.error || "No output",
            error: data.error || null,
          },
        ]);
        if (labId && experimentIndex !== undefined) {
          try {
            const singleResult = [{
              passed: !data.error,
              input: "",
              expected: "",
              actual: data.output || data.error || "No output",
              error: data.error || null,
            }];
            await updateExperimentStatus(labId, experimentIndex, "completed", 100, code, singleResult);
            if (onComplete) onComplete();
          } catch (e) {
            console.error(e);
          }
        }

        if (!data.error) {
          setShowCelebration(true);
          setTimeout(() => {
            setShowCelebration(false);
            if (onAutoExit) onAutoExit();
          }, 5000);
        }
      } else {
        const results = [];
        for (let i = 0; i < testCases.length; i++) {
          const tc = testCases[i];
          const stdin = tc.input || "";
          const expected = (tc.expected || tc.expectedOutput || "").trim();
          const data = await submitCode(code, language, stdin);

          if (data.error) {
            results.push({
              passed: false,
              input: stdin,
              expected,
              actual: data.error,
              error: data.error,
            });
          } else {
            const actualOutput = (data.output || "").trim();
            results.push({
              passed: expected ? actualOutput === expected : null,
              input: stdin,
              expected,
              actual: actualOutput,
              error: null,
            });
          }
        }

        setTestResults(results);
        setActiveTestIdx(0);

        const allPassed = results.every((r) => r.passed === true);
        if (allPassed) {
          setResult("🎉 SUCCESS! All test cases passed!");
          setShowCelebration(true);
          if (labId && experimentIndex !== undefined) {
            try {
              await updateExperimentStatus(labId, experimentIndex, "completed", 100, code, results);
              if (onComplete) onComplete();
            } catch (dbError) {
              console.error(dbError);
            }
          }
          
          setTimeout(() => {
            setShowCelebration(false);
            if (onAutoExit) onAutoExit();
          }, 5000);
        } else {
          setResult("⚠️ Some test cases failed. Keep trying!");
        }
      }

      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (error) {
      setResult("Server Error: " + error.message);
      setTestResults([
        {
          passed: false,
          input: "",
          expected: "",
          actual: "Server Error: " + error.message,
          error: error.message,
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passedCount = testResults.filter((r) => r.passed === true).length;
  const failedCount = testResults.filter((r) => r.passed === false).length;

  return (
    <div className="flex flex-col h-full bg-[#1A1A2E] rounded-xl overflow-hidden border border-[#2D2D44]">
      {showCelebration && <CelebrationSplash />}

      {/* ─── Top Toolbar ─── */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#16162A] border-b border-[#2D2D44]">
        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => availableLanguages.length > 1 && setShowLangDropdown(!showLangDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2A2A3E] border border-[#3D3D5C] text-sm text-neutral-200 transition-all duration-200 ${availableLanguages.length > 1 ? 'hover:bg-[#33334D] cursor-pointer' : 'cursor-default'}`}
          >
            <span className="text-base">{currentLang.icon}</span>
            <span className="font-medium">{currentLang.label}</span>
            {availableLanguages.length > 1 && (
              <ChevronDown
                className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                  showLangDropdown ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {/* Dropdown */}
          {showLangDropdown && availableLanguages.length > 1 && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowLangDropdown(false)}
              />
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#1E1E36] border border-[#3D3D5C] rounded-lg shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                {availableLanguages.map((lang) => (
                  <button
                    key={lang.value}
                    onClick={() => handleLanguageChange(lang.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-100 ${
                      language === lang.value
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-neutral-300 hover:bg-[#2A2A3E]"
                    }`}
                  >
                    <span className="text-base">{lang.icon}</span>
                    <span>{lang.label}</span>
                    {language === lang.value && (
                      <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right-side Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-[#2A2A3E] transition-all duration-200 text-xs"
            title="Reset to default code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <div className="w-px h-5 bg-[#3D3D5C]"></div>
          <button
            onClick={() => setConsoleExpanded(!consoleExpanded)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-neutral-400 hover:text-neutral-200 hover:bg-[#2A2A3E] transition-all duration-200 text-xs"
            title={consoleExpanded ? "Minimize console" : "Maximize console"}
          >
            {consoleExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ─── Code Editor Area ─── */}
      <div className={`flex-1 min-h-0 ${consoleExpanded ? '' : 'flex-grow'}`}>
        <CodeEditor
          code={code}
          setCode={handleEditorChange}
          language={language}
          height="100%"
        />
      </div>

      {/* ─── Bottom Console Panel ─── */}
      {consoleExpanded && (
        <div className="flex flex-col border-t border-[#2D2D44] bg-[#16162A]" style={{ height: `${consoleHeight}px`, minHeight: '100px' }}>
          {/* Resize Handler */}
          <div
            onMouseDown={startResizing}
            className="h-1.5 w-full bg-[#2D2D44] hover:bg-emerald-500/50 cursor-ns-resize transition-colors absolute -top-0.5 z-30"
            title="Drag to resize"
          />

          {/* Console Tabs */}
          <div className="flex items-center justify-between px-1 border-b border-[#2D2D44]">
            <div className="flex">
              <button
                onClick={() => setActiveTab("testcase")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all duration-200 border-b-2 ${
                  activeTab === "testcase"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Testcase
              </button>
              <button
                onClick={() => setActiveTab("result")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all duration-200 border-b-2 ${
                  activeTab === "result"
                    ? "border-emerald-500 text-emerald-400"
                    : "border-transparent text-neutral-500 hover:text-neutral-300"
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                Result
                {testResults.length > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      failedCount > 0
                        ? "bg-red-500/20 text-red-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {passedCount}/{testResults.length}
                  </span>
                )}
              </button>
            </div>

            {/* Run / Submit Buttons */}
            <div className="flex items-center gap-2 px-2 py-1.5">
              <button
                onClick={handleRun}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#2A2A3E] hover:bg-[#33334D] border border-[#3D3D5C] text-neutral-200 text-xs font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isRunning ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 text-emerald-400 group-hover:text-emerald-300" />
                )}
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Submit
              </button>
            </div>
          </div>

          {/* Console Content */}
          <div ref={outputRef} className="flex-1 overflow-auto p-3">

            {/* ── Testcase Tab ── */}
            {activeTab === "testcase" && (
              <div>
                {testCases && testCases.length > 0 ? (
                  <>
                    {/* Test Case Tabs (Pill Style) */}
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {testCases.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestIdx(idx)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                            activeTestIdx === idx
                              ? "bg-[#2A2A3E] text-white border border-[#3D3D5C]"
                              : "text-neutral-500 hover:text-neutral-300 hover:bg-[#2A2A3E]/50"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Selected Test Case Details */}
                    {testCases[activeTestIdx] && (
                      <div className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">
                            Input
                          </label>
                          <div className="bg-[#1A1A2E] border border-[#2D2D44] rounded-lg px-3 py-2.5 font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                            {testCases[activeTestIdx].input || "No input"}
                          </div>
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">
                            Expected Output
                          </label>
                          <div className="bg-[#1A1A2E] border border-[#2D2D44] rounded-lg px-3 py-2.5 font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                            {testCases[activeTestIdx].expected ||
                              testCases[activeTestIdx].expectedOutput ||
                              "No expected output"}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-neutral-500 text-sm py-4">
                    <Terminal className="w-4 h-4" />
                    <span>No test cases provided. Click Run to execute your code.</span>
                  </div>
                )}
              </div>
            )}

            {/* ── Result Tab ── */}
            {activeTab === "result" && (
              <div>
                {isRunning || isSubmitting ? (
                  <div className="flex items-center gap-3 py-6 justify-center">
                    <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                    <span className="text-neutral-400 text-sm">
                      {isRunning ? "Running code..." : "Submitting solution..."}
                    </span>
                  </div>
                ) : testResults.length > 0 ? (
                  <>
                    {/* Summary Header */}
                    <div className="mb-3">
                      {testResults.every((r) => r.passed === true) ? (
                        <div className="flex items-center gap-2 text-emerald-400">
                          <CheckCircle2 className="w-5 h-5" />
                          <span className="font-semibold text-sm">Accepted</span>
                          <span className="text-neutral-500 text-xs ml-1">
                            — All {testResults.length} test cases passed
                          </span>
                        </div>
                      ) : testResults.some((r) => r.passed === false) ? (
                        <div className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold text-sm">Wrong Answer</span>
                          <span className="text-neutral-500 text-xs ml-1">
                            — {passedCount}/{testResults.length} test cases passed
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sky-400">
                          <Terminal className="w-5 h-5" />
                          <span className="font-semibold text-sm">Output</span>
                        </div>
                      )}
                    </div>

                    {/* Test Case Result Tabs */}
                    <div className="flex gap-1.5 mb-3 flex-wrap">
                      {testResults.map((tr, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveTestIdx(idx)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all duration-150 ${
                            activeTestIdx === idx
                              ? "bg-[#2A2A3E] text-white border border-[#3D3D5C]"
                              : "text-neutral-500 hover:text-neutral-300 hover:bg-[#2A2A3E]/50"
                          }`}
                        >
                          {tr.passed === true ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : tr.passed === false ? (
                            <XCircle className="w-3 h-3 text-red-400" />
                          ) : (
                            <Terminal className="w-3 h-3 text-sky-400" />
                          )}
                          Case {idx + 1}
                        </button>
                      ))}
                    </div>

                    {/* Selected Result Detail */}
                    {testResults[activeTestIdx] && (
                      <div className="space-y-3">
                        {testResults[activeTestIdx].input && (
                          <div>
                            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">
                              Input
                            </label>
                            <div className="bg-[#1A1A2E] border border-[#2D2D44] rounded-lg px-3 py-2.5 font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                              {testResults[activeTestIdx].input}
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">
                            Output
                          </label>
                          <div
                            className={`bg-[#1A1A2E] border rounded-lg px-3 py-2.5 font-mono text-sm whitespace-pre-wrap ${
                              testResults[activeTestIdx].error
                                ? "border-red-500/30 text-red-400"
                                : testResults[activeTestIdx].passed === false
                                ? "border-red-500/30 text-red-400"
                                : testResults[activeTestIdx].passed === true
                                ? "border-emerald-500/30 text-emerald-400"
                                : "border-[#2D2D44] text-neutral-300"
                            }`}
                          >
                            {testResults[activeTestIdx].actual || "No output"}
                          </div>
                        </div>
                        {testResults[activeTestIdx].expected && (
                          <div>
                            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1 block">
                              Expected
                            </label>
                            <div className="bg-[#1A1A2E] border border-[#2D2D44] rounded-lg px-3 py-2.5 font-mono text-sm text-neutral-300 whitespace-pre-wrap">
                              {testResults[activeTestIdx].expected}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-neutral-500">
                    <Terminal className="w-8 h-8 mb-2 opacity-40" />
                    <span className="text-sm">
                      Run your code to see results here
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JudgePage;
