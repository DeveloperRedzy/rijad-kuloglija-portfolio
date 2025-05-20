import React from "react";
import { useTheme } from "../../context/ThemeContext";

interface LogoProps {
  force?: "light" | "dark";
  forceLightStyle?: boolean;
}

const Logo: React.FC<LogoProps> = ({ force, forceLightStyle = false }) => {
  const { theme } = useTheme();
  const actualTheme = force ?? theme;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("hero");
    if (element) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  return (
    <a
      href="#hero"
      onClick={handleLogoClick}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <img
        src={
          forceLightStyle
            ? "/logo_light.png"
            : actualTheme === "dark"
              ? "/logo_light.png"
              : "/logo_dark.png"
        }
        alt="Redzy Logo"
        className="w-8 h-8"
      />
      <span
        className={`font-bold text-lg ${
          forceLightStyle ? "text-white" : "text-slate-800 dark:text-white"
        }`}
      >
        Redzy
        <span
          className={`${
            forceLightStyle
              ? "text-primary-400"
              : "text-primary-600 dark:text-primary-400"
          }`}
        >
          .dev
        </span>
      </span>
    </a>
  );
};

export default Logo;
