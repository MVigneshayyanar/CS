import { useState, useRef } from "react";
import CodeEditor from "../components/CodeEditor.jsx";
import { submitCode } from "../services/judgeService";

const JudgePage = () => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(
    `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}`
  );
  const [result, setResult] = useState("");
  
  // Create ref for output section
  const outputRef = useRef(null);

  const handleRun = async () => {
    try {
      const data = await submitCode(code, language);
      setResult(data.output || data.error || "No output");
      
      // Scroll to output section with smooth animation
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (error) {
      setResult("Server Error");
      
      // Scroll to output section even on error
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  const handleSubmit = async () => {
    try {
      // Later you can add scoring/DB submission here
      const data = await submitCode(code, language);
      setResult("✅ Submission Successful:\n" + (data.output || data.error || "No output"));
      
      // Scroll to output section with smooth animation
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
      
    } catch (error) {
      setResult("Server Error");
      
      // Scroll to output section even on error
      setTimeout(() => {
        outputRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <div className="relative">
      {/* Language Selector at top-right */}
      <div className="flex justify-end m-2 sticky top-0">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
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
      <CodeEditor code={code} setCode={setCode} language={language} />

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
