import React from "react";
import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import { programsData } from "@/data/programsData";
import { redirect } from "next/navigation";
import ProgramsClient from "./ProgramsClient";

export const metadata = {
    title: "Explore Programs | Mayoor International School",
    description: "Discover the NCC Leadership Program, National Level Sports Training, Advanced STEM Innovation Lab, and Cultural Arts at Mayoor International School.",
};

export default async function ExplorePrograms({ searchParams }) {
    const params = await searchParams;
    if (params.access !== 'granted') {
        redirect('/');
    }

    return (
        <>
            <Navbar />

            <main className="pt-32 pb-24 bg-gray-50 dark:bg-gray-900 min-h-screen">
                <div className="container mx-auto px-4 md:px-6 max-w-7xl">

                    {/* Top Title Section */}
                    <div className="text-center mb-20">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary dark:text-white mb-6">
                            Explore Our Programs
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Empowering students beyond academics.
                        </p>
                    </div>

                    {/* Programs Alternating Section */}
                    <ProgramsClient programsData={programsData} />

                </div>
            </main>

            <Footer />
        </>
    );
}
