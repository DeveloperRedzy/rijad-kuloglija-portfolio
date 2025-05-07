import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-scroll';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="hero" className="min-h-screen flex items-center pt-20">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div 
            className="md:col-span-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-slate-900 dark:text-white mb-4">
              {t('hero.greeting')} <span className="text-primary-600 dark:text-primary-400">Rijad Kuloglija</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-6">
              {t('hero.title')} <span className="text-primary-600 dark:text-primary-400">5</span> {t('hero.years')} {t('hero.experience')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-2xl">
              {t('hero.description')}
            </p>
            
            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="/Rijad-Kuloglija-CV.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                {t('hero.downloadCV')}
              </a>
              
              <Link
                to="contact"
                spy={true}
                smooth={true}
                offset={-80}
                duration={500}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 rounded-md transition-colors duration-200 cursor-pointer"
              >
                {t('hero.contactMe')}
              </Link>
              
              <div className="flex items-center gap-4 ml-2">
                <a 
                  href="https://github.com/DeveloperRedzy" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://linkedin.com/in/rijad-kuloglija" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                >
                  <Linkedin size={20} />
                </a>
                <a 
                  href="mailto:rkuloglija@gmail.com" 
                  className="text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
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
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-0 bg-primary-500/20 dark:bg-primary-500/10 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-4 bg-primary-500/30 dark:bg-primary-500/20 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-dark-100 p-2 rounded-full w-48 h-48 lg:w-56 lg:h-56 overflow-hidden shadow-lg">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-4xl">
                    Redzy.dev
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 hidden md:block">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0.5
            }}
          >
            <Link
              to="about"
              spy={true}
              smooth={true}
              offset={-80}
              duration={500}
              className="flex flex-col items-center cursor-pointer text-slate-500 hover:text-primary-500 dark:text-slate-400 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <span className="text-sm mb-2">{t('hero.scrollDown')}</span>
              <ArrowDown size={20} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;