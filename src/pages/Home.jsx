import Certifications from "../components/Certifications";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/hero/Hero";
import MembershipsAndAwards from "../components/MembershipsAndAwards";
import Navbar from "../components/Navbar";
import PublicationsTabs from "../components/publications/PublicationsTabs";
import PublicationStats from "../components/publications/PublicationStats";
import References from "../components/References";
import ReviewExperience from "../components/review/ReviewExperience";
import Skills from "../components/Skills";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Projects from "../sections/Projects";

const Home = () => {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      
      {/* Section with subtle top shadow */}
      <div className="relative before:absolute before:top-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent">
        <About />
      </div>
      
      {/* Section with very light gray background */}
      <div className="bg-gray-50">
        <Education />
      </div>
      
      {/* Section with top border */}
      <div className="border-t border-gray-100">
        <Experience />
      </div>
      
      {/* Section with subtle pattern */}
      <div className="bg-white bg-[radial-gradient(#f5f5f5_1px,transparent_1px)] [background-size:16px_16px]">
        <PublicationStats />
      </div>
      
      {/* Section with light blue tint */}
      <div className="bg-blue-50/30">
        <PublicationsTabs />
      </div>
      
      {/* Section with top border and bottom border */}
      <div className="border-y border-gray-100">
        <ReviewExperience />
      </div>
      
      {/* Section with very light gray background */}
      <div className="bg-gray-50">
        <Skills />
      </div>
      
      {/* Section with subtle pattern */}
      <div className="bg-white bg-[radial-gradient(#f5f5f5_1px,transparent_1px)] [background-size:16px_16px]">
        <Projects />
      </div>
      
      {/* Section with light amber tint */}
      <div className="bg-amber-50/30">
        <MembershipsAndAwards />
      </div>
      
      {/* Section with top border */}
      <div className="border-t border-gray-100">
        <Certifications />
      </div>
      
      {/* Section with very light gray background */}
      <div className="bg-gray-50">
        <References />
      </div>
      
      {/* Contact section with subtle top shadow */}
      <div className="relative before:absolute before:top-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-gray-100 before:to-transparent">
        <Contact />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;