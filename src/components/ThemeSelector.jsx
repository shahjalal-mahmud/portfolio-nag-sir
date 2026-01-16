// src/components/ThemeSelector.jsx
import { useTheme } from "../context/ThemeContext";
import { FaPalette, FaFont, FaCheck } from "react-icons/fa";

const ThemeSelector = () => {
    const { theme, toggleTheme, font, toggleFont } = useTheme();

    const fontOptions = [
        "Inter", "Roboto", "Open Sans", "Montserrat", "Poppins", "Lato",
        "Nunito", "Raleway", "Ubuntu", "Merriweather", "Playfair Display", "Work Sans",
        "Source Sans Pro", "DM Sans", "Fira Sans", "Titillium Web", "Noto Sans", "Quicksand",
        "Josefin Sans", "Rubik", "Karla", "Mulish", "Heebo", "Cabin", "Manrope", "PT Sans",
        "Oxygen", "Asap", "Assistant", "Barlow", "Exo 2", "Hind", "Signika", "IBM Plex Sans",
        "Mukta", "Tajawal", "Varela Round", "Catamaran", "Public Sans", "Cairo", "Spartan",
        "Overpass", "Questrial", "Be Vietnam Pro", "Lexend", "Anton", "Zilla Slab", "Arimo",
        "Prompt", "DM Serif Display", "Bebas Neue", "Teko", "Urbanist", "Archivo", "Arvo",
        "Lora", "Inconsolata", "Chivo", "M PLUS 1p", "Acme", "Saira", "Kanit", "Righteous",
        "Bitter", "Caveat", "Dosis", "Yanone Kaffeesatz", "Abel", "Crimson Text", "Sora",
        "Cormorant Garamond", "Barlow Condensed", "Dancing Script", "Pacifico", "Orbitron",
        "Indie Flower", "Frank Ruhl Libre", "Alata", "Amaranth", "Exo", "Vollkorn", "Tinos",
        "Kumbh Sans", "Raleway Dots", "Baloo 2", "Rajdhani", "Edu SA Beginner", "Candal",
        "Noto Serif", "Itim", "Balsamiq Sans", "Yantramanav", "Muli", "EB Garamond",
        "Fugaz One", "Patrick Hand", "Press Start 2P", "Special Elite", "Carter One",
        "Red Hat Display", "Amatic SC", "Unica One", "Chakra Petch", "Rokkitt", "Lobster",
        "Satisfy", "Great Vibes", "Cinzel"
    ];

    const themeOptions = [
        "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
        "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
        "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
        "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
        "night", "coffee", "winter", "dim", "nord", "sunset"
    ];

    // Enhanced Theme Preview component
    const ThemePreview = ({ themeName }) => {
        return (
            <div className="flex items-center gap-3">
                <div className="shrink-0 w-6 h-6 rounded-md border border-base-300 p-0.5">
                    <div className="w-full h-full rounded-sm flex flex-wrap overflow-hidden">
                        <div className="w-1/2 h-1/2 bg-primary" />
                        <div className="w-1/2 h-1/2 bg-secondary" />
                        <div className="w-1/2 h-1/2 bg-accent" />
                        <div className="w-1/2 h-1/2 bg-neutral" />
                    </div>
                </div>
                <span className="text-sm font-medium">
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </span>
            </div>
        );
    };

    // Font Preview component with consistent styling
    const FontPreview = ({ fontName }) => {
        return (
            <div className="flex items-center gap-3">
                <div className="shrink-0 w-6 h-6 rounded-md border border-base-300 flex items-center justify-center">
                    <span className="text-xs" style={{ fontFamily: fontName }}>Aa</span>
                </div>
                <span className="text-sm font-medium" style={{ fontFamily: fontName }}>
                    {fontName}
                </span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Font Selector with Grid Dropdown */}
            <div className="form-control">
                <label className="label pl-0">
                    <span className="label-text flex items-center gap-2 text-sm font-medium">
                        <FaFont className="text-primary text-base" />
                        Font Family
                    </span>
                </label>
                <div className="dropdown w-full" onClick={(e) => e.stopPropagation()}>
                    <label
                        tabIndex={0}
                        className="btn btn-outline bg-base-100 hover:bg-base-200 justify-between w-full text-left"
                    >
                        <FontPreview fontName={font} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </label>
                    <div
                        tabIndex={0}
                        className="dropdown-content p-3 shadow-lg bg-base-100 rounded-box w-full max-h-96 overflow-y-auto mt-1"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {fontOptions.map((fontOption) => (
                                <button
                                    key={fontOption}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent parent menus from reacting
                                        toggleFont(fontOption);
                                    }}
                                    className={`flex items-center justify-between p-2 rounded hover:bg-base-200 ${font === fontOption ? "bg-base-200" : ""
                                        }`}
                                >
                                    <FontPreview fontName={fontOption} />
                                    {font === fontOption && (
                                        <FaCheck className="text-primary text-xs" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Theme Selector with Grid Dropdown */}
            <div className="form-control">
                <label className="label pl-0">
                    <span className="label-text flex items-center gap-2 text-sm font-medium">
                        <FaPalette className="text-primary text-base" />
                        Theme
                    </span>
                </label>
                <div className="dropdown w-full" onClick={(e) => e.stopPropagation()}>
                    <label
                        tabIndex={0}
                        className="btn btn-outline bg-base-100 hover:bg-base-200 justify-between w-full text-left"
                    >
                        <ThemePreview themeName={theme} />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </label>
                    <div
                        tabIndex={0}
                        className="dropdown-content p-3 shadow-lg bg-base-100 rounded-box w-full max-h-96 overflow-y-auto mt-1"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {themeOptions.map((themeOption) => (
                                <button
                                    key={themeOption}
                                    onClick={() => toggleTheme(themeOption)}
                                    className={`flex items-center justify-between p-2 rounded hover:bg-base-200 ${theme === themeOption ? "bg-base-200" : ""
                                        }`}
                                    data-theme={themeOption}
                                >
                                    <ThemePreview themeName={themeOption} />
                                    {theme === themeOption && (
                                        <FaCheck className="text-primary text-xs" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThemeSelector;