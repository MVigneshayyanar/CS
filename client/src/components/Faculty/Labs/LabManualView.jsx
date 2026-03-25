import React from "react";
import { X } from "lucide-react";
import JudgePage from "../../../pages/JudgePage";

const LabManualView = ({ experiment, onClose }) => {
  const experimentCode = `#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}`;

  const labManual = `# Experiment ${experiment.number}: ${experiment.name}

## Objective
To write a simple C program that prints "Hello World!" to the console.

## Theory
The printf() function is used to display output in C programming.
It is defined in the stdio.h header file.

## Algorithm
1. Include necessary header files
2. Define the main function
3. Use printf() to display the message
4. Return 0 to indicate successful execution

## Expected Output
Hello World!

## Procedure
1. Write the code in the editor
2. Compile and run the program
3. Verify the output matches expected result`;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl w-[92vw] max-w-5xl h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">
              Experiment {experiment.number}: {experiment.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Lab Manual &amp; Code Editor
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Split panel */}
        <div className="flex flex-1 min-h-0">
          {/* Lab Manual */}
          <div className="w-1/2 border-r border-slate-100 flex flex-col">
            <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                Lab Manual
              </span>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <pre className="whitespace-pre-wrap text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl p-4 leading-relaxed font-mono">
                {labManual}
              </pre>
            </div>
          </div>

          {/* Code editor */}
          <div className="w-1/2 flex flex-col">
            <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/50">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                Code Editor
              </span>
            </div>
            <div className="flex-1 overflow-auto">
              <JudgePage experimentCode={experimentCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabManualView;
