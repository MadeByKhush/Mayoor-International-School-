"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export default function ProgramsClient({ programsData }) {
    const [selectedProgram, setSelectedProgram] = useState(null);

    // Prevent body wrap scrolling and add ESC key closure when modal is active
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setSelectedProgram(null);
            }
        };

        if (selectedProgram) {
            document.body.style.overflow = "hidden";
            window.addEventListener("keydown", handleKeyDown);
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedProgram]);

    return (
        <>
            {/* Main Listing View */}
            <div className="flex flex-col gap-16 md:gap-24">
                {programsData.map((program, index) => (
                    <div
                        key={program.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
                    >
                        {/* Image Container */}
                        <div className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-xl group ${!program.imageOnLeft ? 'md:order-last' : ''}`}>
                            <Image
                                src={program.image}
                                alt={program.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority={index === 0}
                            />
                        </div>

                        {/* Content Details */}
                        <div className={`flex flex-col justify-center space-y-6 ${!program.imageOnLeft ? 'md:pr-12 lg:pr-16 text-left' : 'md:pl-12 lg:pl-16 text-left'}`}>
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                    {program.title}
                                </h2>
                                {/* Subtle Divider */}
                                <div className="w-16 h-1 bg-primary rounded-full mb-6 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white/30 skew-x-12 translate-x-[-150%] animate-[shimmer_2.5s_infinite]"></div>
                                </div>
                            </div>

                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                {program.description}
                            </p>

                            <div className="pt-4">
                                <button
                                    className="bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                                    onClick={() => setSelectedProgram(program)}
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Detail Modal Viewer */}
            {selectedProgram && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
                    style={{ animation: "fadeIn 0.3s ease-out" }}
                    onClick={() => setSelectedProgram(null)}
                >
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes scaleInUp {
                            from { transform: scale(0.95) translateY(20px); opacity: 0; }
                            to { transform: scale(1) translateY(0); opacity: 1; }
                        }
                    `}</style>

                    {/* Content Box */}
                    <div
                        className="relative w-full max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                        style={{ animation: "scaleInUp 0.4s ease-out both" }}
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking content
                    >
                        {/* Close Button Inside Corner */}
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-white/50 dark:bg-black/50 hover:bg-gray-100 dark:hover:bg-gray-700 backdrop-blur-sm rounded-full p-2 z-50 transition-all duration-300"
                            onClick={() => setSelectedProgram(null)}
                            aria-label="Close modal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Image Half */}
                        <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
                            <Image
                                src={selectedProgram.image}
                                alt={selectedProgram.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {/* Gradient Overlay for seamless blend to text on mobile */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent dark:from-gray-800 md:hidden"></div>
                        </div>

                        {/* Modal Text Half (Scrollable if overflowing) */}
                        <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-12 flex flex-col overflow-y-auto custom-scrollbar">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                                {selectedProgram.title}
                            </h2>
                            <div className="w-16 h-1 bg-primary rounded-full mb-8"></div>

                            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-8">
                                {selectedProgram.fullDescription}
                            </p>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Program Highlights</h3>
                            <ul className="space-y-3">
                                {selectedProgram.highlights.map((highlight, i) => (
                                    <li key={i} className="flex items-start">
                                        <svg className="h-6 w-6 text-primary shrink-0 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                            {highlight}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                                <button
                                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-8 rounded-full shadow shadow-primary/30 transition-all duration-300"
                                    onClick={() => setSelectedProgram(null)}
                                >
                                    Close Info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
