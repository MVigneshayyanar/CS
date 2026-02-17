import React from 'react';

const ExperimentsList = ({ experiments, selectedSubject, onClose, onViewLabManual }) => {
    return (
        <>
            <style>
                {`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;  /* IE and Edge */
                        scrollbar-width: none;     /* Firefox */
                    }
                `}
            </style>

            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700/50 rounded-2xl w-4/5 h-4/5 flex flex-col shadow-2xl">
                    <div className="flex justify-between items-center p-6 border-b border-neutral-700/50">
                        <h2 className="text-2xl font-semibold text-white">
                            All Experiments - {selectedSubject?.name}
                        </h2>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gradient-to-r from-neutral-600 to-neutral-700 text-white rounded-lg hover:from-neutral-700 hover:to-neutral-800 transition-all duration-200 shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto p-6 hide-scrollbar">
                        <div className="grid gap-4">
                            {experiments.map((experiment) => (
                                <div 
                                    key={experiment.id} 
                                    className="flex items-center justify-between p-4 bg-neutral-800/50 backdrop-blur-sm border border-neutral-700/30 rounded-xl hover:bg-neutral-800/70 transition-all duration-200"
                                >
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Experiment {experiment.number}: {experiment.name}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => onViewLabManual(experiment)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                                    >
                                        View Lab Manual
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExperimentsList;