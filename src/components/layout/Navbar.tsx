import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Moon, Sun, Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import Logo from '../shared/Logo';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { name: t('nav.about'), to: 'about' },
    { name: t('nav.experience'), to: 'experience' },
    { name: t('nav.skills'), to: 'skills' },
    { name: t('nav.projects'), to: 'projects' },
    { name: t('nav.contact'), to: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4',
        scrolled 
          ? 'bg-white/90 dark:bg-dark-200/90 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container-custom flex items-center justify-between">
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="nav-link font-medium text-sm cursor-pointer"
              activeClass="active"
            >
              {link.name}
            </Link>
          ))}

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-100"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-700" />
            )}
          </button>

          <LanguageSwitcher />

          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/DeveloperRedzy"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/rijad-kuloglija"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:rkuloglija@gmail.com"
              aria-label="Email"
              className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <Mail size={20} />
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden space-x-4">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-100"
          >
            {theme === 'dark' ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-700" />
            )}
          </button>
          
          <LanguageSwitcher />
          
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-dark-100"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-slate-700 dark:text-slate-200" />
            ) : (
              <Menu size={24} className="text-slate-700 dark:text-slate-200" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-dark-200 shadow-lg py-4 px-6 flex flex-col space-y-4 border-t border-slate-200 dark:border-slate-700">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="nav-link font-medium py-2"
                activeClass="active"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <a
                href="https://github.com/DeveloperRedzy"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Github size={20} />
              </a>
              <a
                href="https://linkedin.com/in/rijad-kuloglija"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:rkuloglija@gmail.com"
                aria-label="Email"
                className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;