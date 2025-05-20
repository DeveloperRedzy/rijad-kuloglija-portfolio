import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, to: string) => {
    e.preventDefault();
    const element = document.getElementById(to);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center pt-20 relative overflow-hidden"
    >
      {/* Mobilni background */}
      <div className="absolute inset-0 md:hidden">
        <div className="absolute inset-0 bg-primary-500/10 dark:bg-primary-500/5 rounded-full animate-spin-slow"></div>
        <div
          className="absolute inset-4 bg-primary-500/20 dark:bg-primary-500/10 rounded-full animate-spin-slow"
          style={{ animationDirection: "reverse" }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="bg-white dark:bg-dark-100 p-2 rounded-full w-48 h-48 overflow-hidden">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <img
                src={theme === "dark" ? "/logo_light.png" : "/logo_dark.png"}
                alt="Redzy Logo"
                className="w-40 h-40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            className="md:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
              {t("hero.greeting")}{" "}
              <span className="text-primary-600 dark:text-primary-400">
                Rijad Kuloglija
              </span>
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-6">
              {t("hero.title")}{" "}
              <span className="text-primary-600 dark:text-primary-400">5</span>{" "}
              {t("hero.years")} {t("hero.experience")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/Rijad-Kuloglija-CV.pdf"
                download
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {t("hero.downloadCV")}
              </a>

              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "contact")}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-md transition-colors duration-200 cursor-pointer"
              >
                {t("hero.contactMe")}
              </a>

              <div className="flex items-center gap-4 ml-2">
                <a
                  href="https://github.com/DeveloperRedzy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/in/rijad-kuloglija"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="mailto:rkuloglija@gmail.com"
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="md:col-span-5 hidden md:flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-64 h-64 lg:w-80 lg:h-80 group">
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-500/10 rounded-full animate-spin-slow group-hover:animate-none group-hover:bg-primary-500/30 dark:group-hover:bg-primary-500/20 transition-all duration-500"></div>
              <div
                className="absolute inset-4 bg-primary-500/30 dark:bg-primary-500/20 rounded-full animate-spin-slow group-hover:animate-none group-hover:bg-primary-500/40 dark:group-hover:bg-primary-500/30 transition-all duration-500"
                style={{ animationDirection: "reverse" }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="bg-white dark:bg-dark-100 p-2 rounded-full w-48 h-48 lg:w-56 lg:h-56 overflow-hidden shadow-lg group-hover:shadow-2xl group-hover:shadow-primary-500/20 dark:group-hover:shadow-primary-400/20 transition-all duration-500"
                  animate={{
                    rotateY: 0,
                    scale: 1,
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotateY: [0, 720, 360],
                    rotateZ: [0, 10, -5, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    times: [0, 0.4, 1],
                    ease: [0.4, 0, 0.2, 1],
                    rotateY: {
                      duration: 1.2,
                      times: [0, 0.4, 1],
                      ease: [0.4, 0, 0.2, 1],
                    },
                  }}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-4xl relative group-hover:from-primary-500 group-hover:to-primary-700 transition-all duration-500 perspective-1000 transform-style-3d">
                    <motion.img
                      src={
                        theme === "dark" ? "/logo_light.png" : "/logo_dark.png"
                      }
                      alt="Redzy Logo"
                      className="w-40 h-40 transition-all duration-500"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                      }}
                      whileHover={{
                        filter:
                          "drop-shadow(0 0 15px rgba(59, 130, 246, 0.8)) brightness(1.2)",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      initial={{ opacity: 0 }}
                      whileHover={{
                        opacity: 1,
                        background:
                          "linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.8) 50%, transparent 55%)",
                        backgroundSize: "200% 200%",
                        animation: "glitch 0.5s linear infinite",
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
