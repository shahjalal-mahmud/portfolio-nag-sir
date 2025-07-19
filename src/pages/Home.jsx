import Certifications from "../components/Certifications";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import MembershipsAndAwards from "../components/MembershipsAndAwards";
import Navbar from "../components/Navbar";
import BookChapters from "../components/publications/BookChapters";
import ConferenceProceedings from "../components/publications/ConferenceProceedings";
import EditedBooks from "../components/publications/EditedBooks";
import JournalArticles from "../components/publications/JournalArticles";
import PublicationsTabs from "../components/publications/PublicationsTabs";
import PublicationStats from "../components/publications/PublicationStats";
import References from "../components/References";
import ReviewExperience from "../components/ReviewExperience";
import Skills from "../components/Skills";
import About from "../sections/About";
import Contact from "../sections/Contact";
import Projects from "../sections/Projects";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Education />
      <Experience />
      <PublicationStats />
      <PublicationsTabs />
      <ReviewExperience />
      <Skills />
      <Projects />
      <MembershipsAndAwards />
      <Certifications />
      <References />
      <Contact />
      <Footer />
      {/* other sections will go below */}
    </div>
  );
};

export default Home;
