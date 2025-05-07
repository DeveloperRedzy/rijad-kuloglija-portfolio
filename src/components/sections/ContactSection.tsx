import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import { useTranslation } from 'react-i18next';

const ContactSection: React.FC = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Kreiraj mailto link sa popunjenim podacima iz forme
    const mailtoLink = `mailto:rkuloglija@gmail.com?subject=Contact from ${name}&body=Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
    
    // Otvori mailto link
    window.location.href = mailtoLink;
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-dark-100">
      <div className="container-custom">
        <SectionHeading 
          title={t('contact.title')} 
          subtitle={t('contact.subtitle')}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">
              {t('contact.letsGetInTouch')}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              {t('contact.description')}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Mail className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">{t('contact.form.email')}</h4>
                  <a 
                    href="mailto:rkuloglija@gmail.com" 
                    className="text-slate-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    rkuloglija@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Linkedin className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">LinkedIn</h4>
                  <a 
                    href="https://linkedin.com/in/rijad-kuloglija" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    linkedin.com/in/rijad-kuloglija
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Github className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">GitHub</h4>
                  <a 
                    href="https://github.com/DeveloperRedzy" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    github.com/DeveloperRedzy
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <MapPin className="text-primary-600 dark:text-primary-400" size={20} />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">{t('about.location')}</h4>
                  <p className="text-slate-800 dark:text-white">
                    {t('about.locationValue')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-6"
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">
              {t('contact.sendMessage')}
            </h3>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-dark-100 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('contact.form.namePlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-dark-100 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t('contact.form.emailPlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  {t('contact.form.message')}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-dark-100 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder={t('contact.form.messagePlaceholder')}
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3"
              >
                {t('contact.form.sendButton')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
