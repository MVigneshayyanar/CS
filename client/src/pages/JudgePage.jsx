import { useState, useRef } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import { submitCode } from "../services/judgeService";

// Default starter code per language
const getStarterCode = (lang) => {
  switch (lang) {
    case 'python':
      return `# Write your solution here\n\n`;
    case 'java':
      return `public class Main {\n  public static void main(String[] args) {\n    // Write your solution here\n  }\n}`;
    case 'c':
      return `#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
    case 'cpp':
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`;
    case 'javascript':
      return `// Write your solution here\n\n`;
    default:
      return `// Write your solution here\n\n`;
  }
};

const JudgePage = ({ initialLanguage, initialCode, experimentCode, onCodeChange, testCases }) => {
  const defaultLang = initialLanguage || "java";
  const startCode = initialCode || experimentCode || getStarterCode(defaultLang);
  
  const [language, setLanguage] = useState(defaultLang);
  const [code, setCode] = useState(startCode);
  const [savedCodes, setSavedCodes] = useState({
    [defaultLang]: startCode
  });
  const [result, setResult] = useState("");
  
  // Create ref for output section
  const outputRef = useRef(null);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    
    // Check if we have saved code for the new language, otherwise get starter code
    const newCode = savedCodes[newLang] !== undefined ? savedCodes[newLang] : getStarterCode(newLang);
    
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  const handleEditorChange = (val) => {
    setCode(val);
    setSavedCodes(prev => ({ ...prev, [language]: val }));
    if (onCodeChange) onCodeChange(val);
  };

  const handleRun = async () => {
    try {
      if (!testCases || testCases.length === 0) {
        const data = await submitCode(code, language);
        setResult(data.output || data.error || "No output");
        setTimeout(() => { outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
        return;
      }
      
      setResult("Running all test cases...");
      setTimeout(() => { outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
      
      let allPassed = true;
      let resultText = "Running Test Cases...\n\n";

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const stdin = tc.input || "";
        const expected = (tc.expected || tc.expectedOutput || "").trim();

        resultText += `--- Sample Test Case ${i + 1} Run ---\nInput: ${stdin}\nExpected: ${expected}\n`;
        setResult(resultText + "Status: Running...\n");

        const data = await submitCode(code, language, stdin);
        
        if (data.error) {
          resultText += `Status: ❌ Error\nOutput: ${data.error}\n\n`;
          allPassed = false;
        } else {
          const actualOutput = (data.output || "").trim();
          if (expected) {
            if (actualOutput === expected) {
              resultText += `Your Output: ${actualOutput}\nStatus: ✅ Passed\n\n`;
            } else {
              resultText += `Your Output: ${actualOutput}\nStatus: ❌ Failed\n\n`;
              allPassed = false;
            }
          } else {
            resultText += `Your Output: ${actualOutput}\n\n`;
          }
        }
        setResult(resultText);
      }
      
      if (allPassed) {
        resultText += "🎉 SUCCESS! All test cases passed! 🎉";
      } else {
        resultText += "⚠️ Some test cases failed. Keep trying!";
      }
      
      setResult(resultText);
      
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
    } catch (error) {
      setResult("Server Error: " + error.message);
      setTimeout(() => { outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!testCases || testCases.length === 0) {
        const data = await submitCode(code, language);
        setResult("✅ Submission Successful:\n" + (data.output || data.error || "No output"));
        setTimeout(() => {
          outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        return;
      }

      setResult("Running test cases...");
      setTimeout(() => { outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
      
      let allPassed = true;
      let resultText = "Running Test Cases...\n\n";

      for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const stdin = tc.input || "";
        const expected = (tc.expected || tc.expectedOutput || "").trim();

        resultText += `Test Case ${i + 1}:\nInput: ${stdin}\nExpected: ${expected}\n`;
        setResult(resultText + "Status: Running...\n");

        const data = await submitCode(code, language, stdin);
        
        if (data.error) {
          resultText += `Status: ❌ Error\nOutput: ${data.error}\n\n`;
          allPassed = false;
        } else {
          const actualOutput = (data.output || "").trim();
          if (actualOutput === expected) {
            resultText += `Status: ✅ Passed\n\n`;
          } else {
            resultText += `Status: ❌ Failed\nYour Output: ${actualOutput}\n\n`;
            allPassed = false;
          }
        }
        setResult(resultText);
      }

      if (allPassed) {
        resultText += "\n🎉 SUCCESS! All test cases passed! 🎉";
      } else {
        resultText += "\n⚠️ Some test cases failed. Keep trying!";
      }
      
      setResult(resultText);
      
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      
    } catch (error) {
      setResult("Server Error: " + error.message);
      
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <div className="relative">
      {/* Language Selector at top-right */}
      <div className="flex justify-end m-2 sticky top-0">
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 bg-gray-800 text-white"
        >
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="javascript">JavaScript</option>
        </select>
      </div>

      {/* Code Editor */}
      <CodeEditor 
        code={code} 
        setCode={handleEditorChange} 
        language={language} 
      />

      {/* Buttons */}
      <div className="flex gap-4 m-2 justify-end">
        <button
          onClick={handleRun}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg font-medium"
        >
          Run
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg font-medium"
        >
          Submit
        </button>
      </div>

      {/* Output Section with ref */}
      <div ref={outputRef} className="m-4">
        <h3 className="text-lg font-semibold text-neutral-200 mt-6 mb-3">Output:</h3>
        <pre className="bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/30 rounded-lg p-4 text-neutral-300 min-h-[100px] overflow-auto">
          {result}
        </pre>
      </div>
    </div>
  );
};

export default JudgePage;
