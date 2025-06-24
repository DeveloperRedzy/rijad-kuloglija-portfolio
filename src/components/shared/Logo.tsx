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
            ? "/logo_light.webp"
            : actualTheme === "dark"
              ? "/logo_light.webp"
              : "/logo_dark.webp"
        }
        alt="Redzy Logo"
        className="w-8 h-8"
      />
      <span
        className={`font-bold text-lg ${
          forceLightStyle ? "text-white" : "text-slate-900 dark:text-white"
        }`}
      >
        Redzy
        <span
          className={`${
            forceLightStyle
              ? "text-primary-300"
              : "text-primary-700 dark:text-primary-300"
          }`}
        >
          .dev
        </span>
      </span>
    </a>
  );
};

export default Logo;
