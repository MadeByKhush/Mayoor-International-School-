import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import GalleryClient from "./GalleryClient";

export const metadata = {
    title: "Our Gallery | Mayoor International School",
    description: "Moments Captured at Mayoor. Browse through our gallery of events, achievements, and everyday life at the school.",
};

export default async function GalleryPage() {

    // Simulate a brief network delay (1500ms) to ensure the sleek loading animation 
    // is visible for at least 1.5 seconds as requested, while the page loads behind.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return (
        <>
            <Navbar />
            <GalleryClient />
            <Footer />
        </>
    );
}
