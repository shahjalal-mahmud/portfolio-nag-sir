import { useState } from "react";
import { Link } from "react-scroll";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", to: "hero" },
    { name: "About", to: "about" },
    {
      name: "Academic",
      sub: [
        { name: "Education", to: "education" },
        { name: "Experience", to: "experience" },
        { name: "Review Experience", to: "review-experience" },
      ],
    },
    { name: "Publications", to: "publications" },
    {
      name: "Achievements",
      sub: [
        { name: "Honors & Awards", to: "memberships-awards" },
        { name: "Certifications", to: "certifications" },
      ],
    },
    {
      name: "Portfolio",
      sub: [
        { name: "Skills", to: "skills" },
        { name: "Projects", to: "projects" },
      ],
    },
    { name: "References", to: "references" },
    { name: "Contact", to: "contact" },
    { name: "Login", to: "auth" },
  ];

  const renderLink = (item) => (
    <Link
      key={item.name}
      to={item.to}
      spy={true}
      smooth={true}
      duration={500}
      offset={-70}
      className="cursor-pointer px-4 py-2 hover:text-primary transition-all"
      onClick={() => setIsOpen(false)}
    >
      {item.name}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-md">
      <div className="navbar max-w-7xl mx-auto px-4">
        <div className="flex-1">
          <Link
            to="hero"
            spy={true}
            smooth={true}
            duration={500}
            className="text-xl font-bold cursor-pointer text-primary"
          >
            Anindya Nag
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-4 items-center">
          {menuItems.map((item) =>
            item.sub ? (
              <div className="dropdown dropdown-hover" key={item.name}>
                <label tabIndex={0} className="px-3 py-2 cursor-pointer">
                  {item.name}
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
                >
                  {item.sub.map((subItem) => (
                    <li key={subItem.name}>{renderLink(subItem)}</li>
                  ))}
                </ul>
              </div>
            ) : (
              renderLink(item)
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl focus:outline-none"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-base-100 shadow-lg px-4 py-2 space-y-2">
          {menuItems.map((item) =>
            item.sub ? (
              <div key={item.name}>
                <p className="font-semibold">{item.name}</p>
                <div className="ml-4 space-y-1">
                  {item.sub.map((subItem) => renderLink(subItem))}
                </div>
              </div>
            ) : (
              renderLink(item)
            )
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
