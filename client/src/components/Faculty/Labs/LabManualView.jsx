import React from 'react';
import JudgePage from '../../../pages/JudgePage';

const LabManualView = ({ experiment, onClose }) => {
    const experimentCode = `#include <stdio.h>

int main() {
    printf("Hello World!\\n");
    return 0;
}`;

    const labManual = `
# Experiment ${experiment.number}: ${experiment.name}

## Objective
To write a simple C program that prints "Hello World!" to the console.

## Theory
The printf() function is used to display output in C programming. It is defined in the stdio.h header file.

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
3. Verify the output matches expected result
  `;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700/50 rounded-2xl w-5/6 h-5/6 flex flex-col shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-neutral-700/50">
                    <h2 className="text-2xl font-semibold text-white">
                        Experiment {experiment.number}: {experiment.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white rounded-lg hover:from-neutral-700 hover:to-neutral-800 transition-all duration-200 shadow-lg"
                    >
                        Back
                    </button>
                </div>
                <div className="flex-1 flex min-h-0">
                    {/* Lab Manual */}
                    <div className="w-1/2 p-6 border-r border-neutral-700/50 relative">
                        <div className="h-full overflow-y-auto pr-2 -mr-2 scrollbar-overlay">
                            <h3 className="text-lg font-semibold mb-4 text-white sticky top-0 bg-neutral-900/95 backdrop-blur-sm py-2 -mx-2 px-2 z-10">
                                Lab Manual
                            </h3>
                            <div className="prose prose-sm max-w-none">
                                <pre className="whitespace-pre-wrap text-sm text-neutral-300 bg-neutral-800/30 p-4 rounded-lg border border-neutral-700/30 leading-relaxed">
                                    {labManual}
                                </pre>
                            </div>
                        </div>
                    </div>

                    {/* Compiler */}
                    <div className="w-1/2 relative">
                        <div className="h-full overflow-y-auto pr-2 -mr-2 scrollbar-overlay">
                            <JudgePage experimentCode={experimentCode} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .scrollbar-overlay {
                    scrollbar-width: thin;
                    scrollbar-color: transparent transparent;
                }
                
                .scrollbar-overlay:hover {
                    scrollbar-color: rgba(20, 184, 166, 0.4) transparent;
                }
                
                .scrollbar-overlay::-webkit-scrollbar {
                    width: 8px;
                    background: transparent;
                }
                
                .scrollbar-overlay::-webkit-scrollbar-track {
                    background: transparent;
                    border-radius: 4px;
                }
                
                .scrollbar-overlay::-webkit-scrollbar-thumb {
                    background: transparent;
                    border-radius: 4px;
                    transition: background 0.2s ease-in-out;
                }
                
                .scrollbar-overlay:hover::-webkit-scrollbar-thumb {
                    background: rgba(20, 184, 166, 0.4);
                }
                
                .scrollbar-overlay::-webkit-scrollbar-thumb:hover {
                    background: rgba(20, 184, 166, 0.6);
                }
                
                .scrollbar-overlay::-webkit-scrollbar-corner {
                    background: transparent;
                }
            `}</style>
        </div>
    );
};

export default LabManualView;