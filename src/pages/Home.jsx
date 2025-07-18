import Certifications from "../components/Certifications";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import MembershipsAndAwards from "../components/MembershipsAndAwards";
import References from "../components/References";
import ReviewExperience from "../components/ReviewExperience";
import Skills from "../components/Skills";
import About from "../sections/About";
import Projects from "../sections/Projects";

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <Education/>
      <Experience/>
      <ReviewExperience/>
      <MembershipsAndAwards/>
      <Skills/>
      <Projects/>
      <Certifications/>
      <References/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
