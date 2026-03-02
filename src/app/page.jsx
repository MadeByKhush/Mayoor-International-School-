import Navbar from "@/Components/Navbar/Navbar";
import Hero from "@/Components/Hero/Hero";
import About from "@/Components/About/About";
import VirtualTour from "@/Components/VirtualTour/VirtualTour";
import Curriculum from "@/Components/Curriculum/Curriculum";
import Events from "@/Components/RecentEvents/Events";
import Facilities from "@/Components/Facilities/Facilities";
import AdmissionCTA from "@/Components/AdmissionCTA/AdmissionCTA";
import Footer from "@/Components/Footer/Footer";

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
