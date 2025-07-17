import Education from "../components/Education";
import Experience from "../components/Experience";
import Hero from "../components/Hero";
import Publication from "../components/Publications/publications";
import About from "../sections/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <Education/>
      <Experience/>
      <Publication/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
