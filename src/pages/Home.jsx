import Education from "../components/Education";
import Hero from "../components/Hero";
import About from "../sections/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <Education/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
