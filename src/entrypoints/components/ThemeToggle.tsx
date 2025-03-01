// :root {
//     --background-light: #f5f5f7;
//     --text-light: #333333;
//     --background-dark: #1c1c1e;
//     --text-dark: #ffffff;
//     --toggle-light: #FD632F;
//     --toggle-dark: #34C759;
// }
import React, {useEffect, useState} from "react";

export const ThemeToggle = ({ onClick }: { onClick?: () => void }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("excalidraw-theme") || "light";
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("excalidraw-theme", newTheme);
        console.log(newTheme);

        if (onClick) {
            onClick();
        }
    };

    return (<>
            <div className={"relative inline-block"}>
                <input
                    type="checkbox"
                    id="mode-toggle"
                    className="peer hidden"
                    checked={theme === "dark"}
                    onChange={toggleTheme}
                />
                <label
                    htmlFor="mode-toggle"
                    className={`block w-16 h-8 rounded-full cursor-pointer transition-colors duration-300 ease-in-out
                after:content-[''] after:absolute after:top-1 after:left-1 after:w-6 after:h-6 after:bg-white after:rounded-full after:transition-all after:duration-300 after:ease-in-out
                peer-checked:after:left-9 ${theme === "dark" ? "bg-gray-800" : "bg-gray-300"}`}
                >
                    <svg
                        className="absolute top-1 left-1 w-6 h-6 p-1 transition-all duration-300 ease-in-out"
                        aria-hidden="true"
                        style={{pointerEvents: "none"}}
                        viewBox="0 0 24 24" fill="none"
                        stroke="white" strokeWidth="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                    <svg
                        className="absolute top-1 left-9 w-6 h-6 p-1 transition-all duration-300 ease-in-out"
                        aria-hidden="true"
                        style={{pointerEvents: "none"}}
                        viewBox="0 0 24 24" fill="none"
                        stroke="black" strokeWidth="2">

                        <g className="sun-beams" stroke="currentColor">
                            <circle className="sun" cx="12" cy="12" r="6" fill="currentColor"/>
                            <line x1="12" y1="1" x2="12" y2="3"/>
                            <line x1="12" y1="21" x2="12" y2="23"/>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                            <line x1="1" y1="12" x2="3" y2="12"/>
                            <line x1="21" y1="12" x2="23" y2="12"/>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                        </g>
                    </svg>
                </label>
            </div>
    </>);
};