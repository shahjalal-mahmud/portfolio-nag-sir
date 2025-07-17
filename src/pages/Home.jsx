import Education from "../components/Education";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import About from "../sections/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <Education/>
      <Experience/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
