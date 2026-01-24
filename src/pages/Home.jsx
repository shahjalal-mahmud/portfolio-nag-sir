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
    <div className="bg-base-100 text-base-content transition-colors duration-300">
      <Navbar />
      <Hero />
      
      {/* Section with subtle top shadow */}
      <div className="relative before:absolute before:top-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-base-content/10 before:to-transparent">
        <About />
      </div>
      
      {/* Section with very light gray background */}
      <div className="bg-base-200">
        <Education />
      </div>
      
      {/* Section with top border */}
      <div className="border-t border-base-content/10">
        <Experience />
      </div>
      
      {/* Section with subtle pattern */}
      <div className="bg-base-100 bg-[radial-gradient(var(--bc)_0.5px,transparent_0.5px)] [background-size:16px_16px] [background-position:center] opacity-90">
        <PublicationStats />
      </div>
      
      {/* Section with light blue tint */}
      <div className="bg-base-300/50">
        <PublicationsTabs />
      </div>
      
      {/* Section with top border and bottom border */}
      <div className="border-y border-base-content/10">
        <ReviewExperience />
      </div>
      
      {/* Section with very light gray background */}
      <div className="bg-base-200">
        <Skills />
      </div>
      
      {/* Section with subtle pattern */}
      {/* <div className="bg-base-100 bg-[radial-gradient(var(--bc)_0.5px,transparent_0.5px)] [background-size:16px_16px] [background-position:center] opacity-90">
        <Projects />
      </div> */}
      
      {/* Section with light amber tint */}
      <div className="bg-base-300/50">
        <MembershipsAndAwards />
      </div>
      
      {/* Section with top border */}
      <div className="border-t border-base-content/10">
        <Certifications />
      </div>
      
      {/* Section with very light gray background */}
      {/* <div className="bg-base-200">
        <References />
      </div> */}
      
      {/* Contact section with subtle top shadow */}
      <div className="relative before:absolute before:top-0 before:w-full before:h-1 before:bg-gradient-to-r before:from-transparent before:via-base-content/10 before:to-transparent">
        <Contact />
      </div>
      
      <Footer />
    </div>
  );
};

export default Home;