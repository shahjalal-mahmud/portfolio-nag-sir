import {
  FaLinkedin,
  FaResearchgate,
  FaGoogle,
  FaOrcid,
  FaGithub,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-base-100 py-10 px-4 md:px-10" id="hero">
      <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-8">
        {/* Text Content */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            ANINDYA NAG
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Lecturer, Dept. of Computer Science & Engineering<br />
            Northern University of Business and Technology, Khulna
          </p>
          <p className="text-sm mb-6 text-gray-600 dark:text-gray-400">
            Health Informatics • Medical IoT • Neuroscience • Machine Learning
          </p>

          {/* Location & Contact */}
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            <p className="flex items-center gap-2"><FaMapMarkerAlt /> Damodar, Khulna, Bangladesh</p>
            <p>Email: <a href="mailto:anindyanag@ieee.org" className="link">anindyanag@ieee.org</a></p>
            <p>Mobile: +880 1795617168</p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="https://www.linkedin.com/in/anindya-nag-892b19190/" target="_blank" className="btn btn-sm btn-outline">
              <FaLinkedin /> LinkedIn
            </a>
            <a href="https://www.researchgate.net/profile/Anindya-Nag-3" target="_blank" className="btn btn-sm btn-outline">
              <FaResearchgate /> ResearchGate
            </a>
            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Fscholar.google.com%2Fcitations%3Fhl%3Den%26user%3DV4OLVPAAAAAJ%26fbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExeEc2OHp5SUE3Y0hMblVyWQEeGYUFYMIJHQBBfXwcrEozHRUDpHB6A2I-IAdn4ZwF02nJ1GpS0jHbI2A6m8Q_aem_antc60W54NdQfNtdmngVBg&h=AT0iTSwFrKCrxTj5krt5GBLeNIPviwjmkZlUdScz69jvcCQmYUdN2LeK3XLSbDCmRkvveOFX_A7feI_w5t4AYlydYAL0xe_aeArGOufKqzDuQlReHtbvBeoRjdqknO45LG32zw" target="_blank" className="btn btn-sm btn-outline">
              <FaGoogle /> Google Scholar
            </a>
            <a href="https://l.facebook.com/l.php?u=https%3A%2F%2Forcid.org%2F0000-0001-6518-8233%3Ffbclid%3DIwZXh0bgNhZW0CMTAAYnJpZBExeEc2OHp5SUE3Y0hMblVyWQEeEcYQNYN6m36ql-9ef4lMAYj9d_wmkTE6NcenxfuQvFXlrFVlqEUI2bhHLv0_aem_MYAX4TtpxxlDLGWIf6f-uQ&h=AT1uYf0WLwlVj8rG5OOuxVAtLw60e7b6AysbFJ_WyMgg_sqjHEtOcbsd50GZayqIiNisKyYKoXEmmDQ90FmQXp_fZkZSfRgjtcAXZMtvbJ9rzPgXbBP4GdvK73QbRu1opf5-oQ" target="_blank" className="btn btn-sm btn-outline">
              <FaOrcid /> ORCID
            </a>
            <a href="https://github.com/AnindyaNag" target="_blank" className="btn btn-sm btn-outline">
              <FaGithub /> GitHub
            </a>
          </div>
        </div>

        {/* Profile Image */}
        <div className="flex-1 flex justify-center">
          <img
            src="/images/A.jpg"
            alt="Anindya Nag"
            className="w-52 h-52 md:w-64 md:h-64 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
