import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { Link } from "react-scroll";
import Logo from "../shared/Logo";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="py-12 bg-slate-900 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Logo force="light" forceLightStyle={true} />
            <p className="mt-4 text-slate-400 max-w-md">
              {t("footer.description")}
            </p>

            <div className="flex items-center space-x-4 mt-6">
              <a
                href="https://github.com/DeveloperRedzy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/rijad-kuloglija"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:rkuloglija@gmail.com"
                className="text-slate-400 hover:text-primary-400 transition-colors duration-200"
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
                <Link
                  to="about"
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="experience"
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.experience")}
                </Link>
              </li>
              <li>
                <Link
                  to="skills"
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.skills")}
                </Link>
              </li>
              <li>
                <Link
                  to="projects"
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.projects")}
                </Link>
              </li>
              <li>
                <Link
                  to="contact"
                  spy={true}
                  smooth={true}
                  offset={-80}
                  duration={500}
                  className="text-slate-400 hover:text-primary-400 transition-colors duration-200 cursor-pointer"
                >
                  {t("nav.contact")}
                </Link>
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
