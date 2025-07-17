import Hero from "../components/Hero";
import About from "../sections/About";

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
