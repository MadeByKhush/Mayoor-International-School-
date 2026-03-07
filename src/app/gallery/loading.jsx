"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center gap-4">
                {/* Simple, elegant spinner using daisyUI/Tailwind */}
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-sm font-medium tracking-wide text-gray-500 uppercase">
                    Loading
                </p>
            </div>
        </motion.div>
    );
}
