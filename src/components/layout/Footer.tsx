import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import Logo from "../shared/Logo";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

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
    <footer className="py-12 bg-slate-900 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo force="light" forceLightStyle={true} />
            <p className="mt-4 text-slate-300 max-w-md">
              {t("footer.description")}
            </p>

            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://github.com/DeveloperRedzy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-primary-300 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/rijad-kuloglija"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-primary-300 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:rkuloglija@gmail.com"
                className="text-slate-300 hover:text-primary-300 transition-colors duration-200"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "about")}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.about")}
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  onClick={(e) => handleNavClick(e, "experience")}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.experience")}
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  onClick={(e) => handleNavClick(e, "skills")}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.skills")}
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => handleNavClick(e, "projects")}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.projects")}
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.contact")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {t("footer.contactInfo")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:rkuloglija@gmail.com"
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                >
                  {t("about.emailValue")}
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/rijad-kuloglija"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                >
                  linkedin.com/in/rijad-kuloglija
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 text-center">
          <p className="text-slate-500">
            &copy; {currentYear} Rijad Kuloglija. {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
