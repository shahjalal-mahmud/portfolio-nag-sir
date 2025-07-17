import Education from "../components/Education";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import ReviewExperience from "../components/ReviewExperience";
import About from "../sections/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <Education/>
      <Experience/>
      <ReviewExperience/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
