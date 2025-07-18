import Certifications from "../components/Certifications";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MembershipsAndAwards from "../components/MembershipsAndAwards";
import Navbar from "../components/Navbar";
import References from "../components/References";
import ReviewExperience from "../components/ReviewExperience";
import Skills from "../components/Skills";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Projects from "../sections/Projects";

const Home = () => {
  return (
    <div>
      <Navbar/>
      <Hero />
      <About/>
      <Education/>
      <Experience/>
      <ReviewExperience/>
      <Skills/>
      <Projects/>
      <MembershipsAndAwards/>
      <Certifications/>
      <References/>
      <Contact/>
      <Footer/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
