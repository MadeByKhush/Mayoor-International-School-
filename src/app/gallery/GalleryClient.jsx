"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { galleryImages } from "@/data/galleryData";

export default function GalleryClient() {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Swipe state for mobile navigation
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEndAction = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) handleNext();
        else if (distance < -minSwipeDistance) handlePrev();
    };

    const changeImage = useCallback((step) => {
        setIsAnimating(true);
        setTimeout(() => {
            setSelectedIndex((prev) => {
                if (prev === null) return null;
                const newIndex = prev + step;
                if (newIndex < 0) return galleryImages.length - 1;
                if (newIndex >= galleryImages.length) return 0;
                return newIndex;
            });
            setTimeout(() => setIsAnimating(false), 50);
        }, 150); // wait for fade out
    }, []);

    const handleNext = useCallback(() => changeImage(1), [changeImage]);
    const handlePrev = useCallback(() => changeImage(-1), [changeImage]);

    // Prevent body scroll and handle keyboard
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedIndex === null) return;
            if (e.key === "Escape") setSelectedIndex(null);
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
        };

        if (selectedIndex !== null) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex, handleNext, handlePrev]);

    const activeImage = selectedIndex !== null ? galleryImages[selectedIndex] : null;

    return (
        <main className="pt-32 pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">Our Gallery</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Moments Captured at Mayoor</p>
                </div>

                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 md:gap-6 space-y-4 md:space-y-6">
                    {galleryImages.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative overflow-hidden break-inside-avoid rounded-xl bg-gray-200 dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer"
                            onClick={() => setSelectedIndex(index)}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={image.width}
                                height={image.height}
                                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Instagram-Style Lightbox Modal */}
            {selectedIndex !== null && activeImage && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
                    style={{ animation: "fadeIn 0.3s ease-out" }}
                    onClick={() => setSelectedIndex(null)}
                >
                    <style>{`
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes scaleIn {
                            from { transform: scale(0.95); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        .modal-content-transition {
                            transition: opacity 150ms ease-in-out, transform 300ms ease-in-out;
                        }
                    `}</style>

                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 md:top-6 md:right-6 text-white/80 hover:text-white hover:scale-110 hover:brightness-110 focus:outline-none z-50 p-2.5 bg-black/50 backdrop-blur-sm rounded-full transition-all duration-300"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIndex(null);
                        }}
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Left Navigation Arrow (Desktop) */}
                    <button
                        className="absolute left-4 md:left-8 text-white/70 hover:text-white hover:scale-110 focus:outline-none z-50 p-3 bg-black/40 backdrop-blur-sm hover:bg-black/80 rounded-full transition-all duration-300 hidden md:flex"
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                        }}
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Navigation Arrow (Desktop) */}
                    <button
                        className="absolute right-4 md:right-8 text-white/70 hover:text-white hover:scale-110 focus:outline-none z-50 p-3 bg-black/40 backdrop-blur-sm hover:bg-black/80 rounded-full transition-all duration-300 hidden md:flex"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                        }}
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Image Container */}
                    <div
                        className="relative w-full h-[100svh] md:h-[90vh] max-w-[900px] flex items-center justify-center p-4 md:p-0 pointer-events-none"
                        style={{ animation: "scaleIn 0.3s ease-out 0.1s both" }}
                    >
                        <div
                            className={`relative w-full h-full pointer-events-auto rounded-2xl overflow-hidden md:shadow-2xl flex items-center justify-center bg-transparent group modal-content-transition ${isAnimating ? "opacity-0 scale-[0.98]" : "opacity-100 scale-100"}`}
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEndAction}
                        >
                            <Image
                                src={activeImage.src}
                                alt={activeImage.alt}
                                fill
                                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                                sizes="(max-width: 900px) 100vw, 900px"
                                priority
                            />
                        </div>

                        {/* Mobile Nav Overlay (invisible zones for tapping next/prev on mobile where buttons are hidden) */}
                        <div className="absolute inset-y-0 left-0 w-1/4 z-40 md:hidden pointer-events-auto" onClick={(e) => { e.stopPropagation(); handlePrev(); }}></div>
                        <div className="absolute inset-y-0 right-0 w-1/4 z-40 md:hidden pointer-events-auto" onClick={(e) => { e.stopPropagation(); handleNext(); }}></div>

                    </div>
                </div>
            )}
        </main>
    );
}
