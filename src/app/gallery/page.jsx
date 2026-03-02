import Navbar from "@/Components/Navbar/Navbar";
import Footer from "@/Components/Footer/Footer";
import GalleryClient from "./GalleryClient";

export const metadata = {
    title: "Our Gallery | Mayoor International School",
    description: "Moments Captured at Mayoor. Browse through our gallery of events, achievements, and everyday life at the school.",
};

export default function GalleryPage() {
    return (
        <>
            <Navbar />
            <GalleryClient />
            <Footer />
        </>
    );
}
