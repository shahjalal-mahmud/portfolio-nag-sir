import { useState, useRef, useEffect } from "react"; // Added useRef, useEffect
import { Link } from "react-scroll";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { FiMenu, FiX, FiChevronDown, FiLogIn, FiLogOut } from "react-icons/fi";
import { FaPalette, FaChevronDown as FaDown, FaChevronUp } from "react-icons/fa"; // Added icons
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from '../components/common/ConfirmationModal'
import Toast from '../components/common/Toast'
import ThemeSelector from "./ThemeSelector"; // Ensure this path is correct

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState("hero");
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("");

    // Theme selector states and refs
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const desktopThemeMenuRef = useRef(null);
    const mobileThemeMenuRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isThemeMenuOpen) return;

            const clickedOutsideDesktop =
                desktopThemeMenuRef.current &&
                !desktopThemeMenuRef.current.contains(event.target);

            const clickedOutsideMobile =
                mobileThemeMenuRef.current &&
                !mobileThemeMenuRef.current.contains(event.target);

            if (clickedOutsideDesktop && clickedOutsideMobile) {
                setIsThemeMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isThemeMenuOpen]);

    const menuItems = [
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
                : "text-base-content hover:bg-base-200"
                }`}
        >
            {item.name}
        </Link>
    );

    const handleLogout = async () => {
        try {
            await logout();
            setToastMessage("Logout successful!");
            setToastType("success");
            setShowToast(true);
            setIsOpen(false);
            setOpenDropdown(null);
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            setToastMessage(err.message || "Logout failed. Please try again.");
            setToastType("error");
            setShowToast(true);
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        setShowLogoutModal(false);
        await handleLogout();
    };

    return (
        <header className="sticky top-0 z-50 text-base-content font-bold shadow-md bg-base-100/90 backdrop-blur-md">
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-2">
                <div className="flex-1">
                    <Link
                        to="hero"
                        spy={true}
                        smooth={true}
                        duration={500}
                        offset={-70}
                        onSetActive={() => setActive("hero")}
                        className="text-xl sm:text-2xl font-bold cursor-pointer text-primary"
                    >
                        Anindya Nag
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm">
                    {menuItems.map((item) =>
                        item.sub ? (
                            <div className="dropdown dropdown-hover" key={item.name}>
                                <label
                                    tabIndex={0}
                                    className={`px-2 py-2 cursor-pointer whitespace-nowrap border-b-2 transition-all ${item.sub.some((s) => s.to === active)
                                        ? "border-primary text-primary"
                                        : "border-transparent hover:border-primary"
                                        }`}
                                >
                                    {item.name}
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content menu p-2 shadow bg-base-100 text-base-content rounded-box w-52"
                                >
                                    {item.sub.map((subItem) => (
                                        <li key={subItem.name}>{renderLink(subItem)}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <div
                                key={item.name}
                                className={`px-2 py-2 cursor-pointer whitespace-nowrap border-b-2 transition-all ${active === item.to
                                    ? "border-primary text-primary"
                                    : "border-transparent hover:border-primary"
                                    }`}
                            >
                                {renderLink(item)}
                            </div>
                        )
                    )}

                    {/* Theme Selector Integration */}
                    <div className="relative ml-1 xl:ml-2" ref={desktopThemeMenuRef}>
                        <button
                            className="btn btn-ghost btn-sm gap-1 normal-case px-2 xl:px-3"
                            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                        >
                            <FaPalette className="text-lg" />
                            <span className="hidden xl:inline">Theme</span>
                            {isThemeMenuOpen ? <FaChevronUp className="text-xs" /> : <FaDown className="text-xs" />}
                        </button>

                        <div
                            onClick={(e) => e.stopPropagation()} // Add this line
                            className={`absolute right-0 mt-2 w-72 sm:w-80 md:w-96 bg-base-200 rounded-box shadow-xl p-4 z-50 transition-all duration-200 ${isThemeMenuOpen
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2 pointer-events-none"
                                }`}
                        >
                            <ThemeSelector />
                        </div>
                    </div>

                    {/* Login/Logout Button for Desktop */}
                    {user ? (
                        <button
                            onClick={handleLogoutClick}
                            className="ml-2 xl:ml-4 px-2 xl:px-3 py-2 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors flex items-center gap-1 whitespace-nowrap"
                        >
                            <FiLogOut className="text-sm" />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className="ml-2 xl:ml-4 px-2 xl:px-3 py-2 rounded-md bg-info/10 text-info hover:bg-info/20 transition-colors flex items-center gap-1 whitespace-nowrap"
                        >
                            <FiLogIn className="text-sm" />
                            <span>Login</span>
                        </NavLink>
                    )}
                </div>

                {/* Mobile Menu Actions (Theme + Hamburger) */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* Theme Selector for Mobile */}
                    <div className="relative" ref={mobileThemeMenuRef}>
                        <button
                            className="btn btn-ghost btn-circle btn-sm"
                            onClick={() => {
                                setIsThemeMenuOpen((prev) => !prev);
                                setIsOpen(false); // close hamburger
                            }}
                        >
                            <FaPalette className="text-lg" />
                        </button>
                        <div
                            className={`absolute right-0 mt-2 w-72 sm:w-80 bg-base-200 rounded-box shadow-xl p-4 z-50 transition-all duration-200 ${isThemeMenuOpen
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 -translate-y-2 pointer-events-none"
                                }`}
                        >
                            <ThemeSelector />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            setIsOpen((prev) => !prev);
                            setIsThemeMenuOpen(false); // close theme selector
                        }}
                        className="text-2xl text-base-content focus:outline-none p-1"
                    >
                        {isOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Slide-in Menu */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 bg-black/50 lg:hidden z-98"
                            onClick={() => {
                                setIsOpen(false);
                                setOpenDropdown(null);
                            }}
                        />

                        {/* Drawer */}
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.35 }}
                            className="fixed top-0 right-0 h-dvh w-[85%] max-w-sm bg-base-100 shadow-2xl z-99 lg:hidden flex flex-col"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-end h-16 px-4 shrink-0">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        setOpenDropdown(null);
                                    }}
                                    className="text-2xl text-base-content hover:opacity-70"
                                    aria-label="Close menu"
                                >
                                    <FiX />
                                </button>
                            </div>

                            {/* Menu content */}
                            <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
                                {menuItems.map((item) =>
                                    item.sub ? (
                                        <div key={item.name}>
                                            <button
                                                className="flex w-full items-center justify-between px-3 py-2 rounded-md font-semibold hover:bg-base-200"
                                                onClick={() =>
                                                    setOpenDropdown(
                                                        openDropdown === item.name ? null : item.name
                                                    )
                                                }
                                            >
                                                <span>{item.name}</span>
                                                <FiChevronDown
                                                    className={`transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : ""
                                                        }`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {openDropdown === item.name && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                        className="ml-4 mt-1 space-y-1 overflow-hidden border-l border-base-300 pl-3"
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

                                {/* Auth */}
                                <div className="border-t border-base-300 pt-4 mt-4">
                                    {user ? (
                                        <button
                                            onClick={handleLogoutClick}
                                            className="flex w-full items-center gap-2 px-4 py-2 rounded-md bg-error/10 text-error hover:bg-error/20"
                                        >
                                            <FiLogOut />
                                            <span>Logout</span>
                                        </button>
                                    ) : (
                                        <NavLink
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex w-full items-center gap-2 px-4 py-2 rounded-md bg-info/10 text-info hover:bg-info/20"
                                        >
                                            <FiLogIn />
                                            <span>Login</span>
                                        </NavLink>
                                    )}
                                </div>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>


            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}

            <ConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout?"
                confirmText="Logout"
                cancelText="Cancel"
                confirmColor="red"
            />
        </header>
    );
};

export default Navbar;