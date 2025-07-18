import { useState } from "react";
import { Link } from "react-scroll";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState("hero");
    const [openDropdown, setOpenDropdown] = useState(null);

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
        { name: "Publications",
            sub: [
                { name: "Summary", to: "summary"},
                { name: "Edited Books", to: "edited-books"},
                { name: "Journal Articles", to: "journal-articles"},
                { name: "Conference Proceedings", to: "conference-proceedings"},
                { name: "Book Chapters", to: "book-chapters"},
            ]
         },
        {
            name: "Portfolio",
            sub: [
                { name: "Skills", to: "skills" },
                { name: "Projects", to: "projects" },
            ],
        },
        {
            name: "Achievements",
            sub: [
                { name: "Honors & Awards", to: "memberships-awards" },
                { name: "Certifications", to: "certifications" },
            ],
        },
        { name: "References", to: "references" },
        { name: "Contact", to: "contact" },
    ];

    const renderLink = (item) => (
        <Link
            key={item.name}
            to={item.to}
            spy={true}
            smooth={true}
            duration={500}
            offset={-70}
            onSetActive={() => setActive(item.to)}
            onClick={() => {
                setIsOpen(false);
                setOpenDropdown(null);
            }}
            className={`block w-full px-4 py-2 rounded-md cursor-pointer transition-all text-sm ${active === item.to
                    ? "bg-primary text-white"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
        >
            {item.name}
        </Link>
    );

    return (
        <header className="sticky top-0 z-50 bg-white text-gray-800 font-bold shadow-md">
            <div className="navbar max-w-7xl mx-auto px-4 flex justify-between items-center py-2">
                <div className="flex-1">
                    <Link
                        to="hero"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-70}
                        onSetActive={() => setActive("hero")}
                        className="text-2xl font-bold cursor-pointer text-primary"
                    >
                        Anindya Nag
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-2 text-sm">
                    {menuItems.map((item) =>
                        item.sub ? (
                            <div className="dropdown dropdown-hover" key={item.name}>
                                <label
                                    tabIndex={0}
                                    className={`px-2 py-2 cursor-pointer border-b-2 transition-all ${item.sub.some((s) => s.to === active)
                                            ? "border-primary text-primary"
                                            : "border-transparent hover:border-primary"
                                        }`}
                                >
                                    {item.name}
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-white text-gray-800 rounded-box w-52"
                                >
                                    {item.sub.map((subItem) => (
                                        <li key={subItem.name}>{renderLink(subItem)}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div
                                key={item.name}
                                className={`px-2 py-2 cursor-pointer border-b-2 transition-all ${active === item.to
                                        ? "border-primary text-primary"
                                        : "border-transparent hover:border-primary"
                                    }`}
                            >
                                {renderLink(item)}
                            </div>
                        )
                    )}
                </div>

                {/* Mobile Hamburger Icon */}
                <div className="lg:hidden absolute top-4 right-4 z-50">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="text-2xl text-gray-800 focus:outline-none"
                    >
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.3 }}
                        className="lg:hidden fixed top-0 right-0 w-72 h-full bg-white text-gray-800 shadow-lg z-40 overflow-y-auto px-4 pt-20 pb-6 space-y-4"
                    >
                        {menuItems.map((item) =>
                            item.sub ? (
                                <div key={item.name}>
                                    <div
                                        className="flex items-center justify-between px-2 py-2 font-semibold cursor-pointer hover:bg-gray-100 rounded-md"
                                        onClick={() =>
                                            setOpenDropdown(
                                                openDropdown === item.name ? null : item.name
                                            )
                                        }
                                    >
                                        <span>{item.name}</span>
                                        <FiChevronDown
                                            className={`transition-transform ${openDropdown === item.name ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>

                                    <AnimatePresence>
                                        {openDropdown === item.name && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="ml-4 pl-2 border-l border-gray-300 space-y-1 mt-1"
                                            >
                                                {item.sub.map((subItem) => renderLink(subItem))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                renderLink(item)
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
