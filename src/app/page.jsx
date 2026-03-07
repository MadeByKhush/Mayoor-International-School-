import Navbar from "@/components/layout/Navbar/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import VirtualTour from "@/components/VirtualTour/VirtualTour";
import Curriculum from "@/components/Curriculum/Curriculum";
import Events from "@/components/RecentEvents/Events";
import Facilities from "@/components/Facilities/Facilities";
import AdmissionCTA from "@/components/AdmissionCTA/AdmissionCTA";
import Footer from "@/components/layout/Footer/Footer";

export default function Home() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <About />
                <Curriculum />
                <Events />
                <VirtualTour />
                <Facilities />
                <AdmissionCTA />
            </main>
            <Footer />
        </>
    );
}
