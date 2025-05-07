import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar } from 'lucide-react';
import SectionHeading from '../shared/SectionHeading';
import { useTranslation } from 'react-i18next';

interface ExperienceItem {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  type: string;
}

const ExperienceSection: React.FC = () => {
  const { t } = useTranslation();

  const getDescription = (key: string): string[] => {
    const desc = t(key, { returnObjects: true });
    return Array.isArray(desc) ? desc : [];
  };

  const experiences: ExperienceItem[] = [
    {
      title: t('experience.items.procredit.title'),
      company: t('experience.items.procredit.company'),
      location: t('experience.items.procredit.location'),
      period: t('experience.items.procredit.period'),
      type: t('experience.types.full-time'),
      description: getDescription('experience.items.procredit.description')
    },
    {
      title: t('experience.items.arkona.title'),
      company: t('experience.items.arkona.company'),
      location: t('experience.items.arkona.location'),
      period: t('experience.items.arkona.period'),
      type: t('experience.types.part-time'),
      description: getDescription('experience.items.arkona.description')
    },
    {
      title: t('experience.items.superlex.title'),
      company: t('experience.items.superlex.company'),
      location: t('experience.items.superlex.location'),
      period: t('experience.items.superlex.period'),
      type: t('experience.types.contractor'),
      description: getDescription('experience.items.superlex.description')
    },
    {
      title: t('experience.items.bloola.title'),
      company: t('experience.items.bloola.company'),
      location: t('experience.items.bloola.location'),
      period: t('experience.items.bloola.period'),
      type: t('experience.types.contractor'),
      description: getDescription('experience.items.bloola.description')
    },
    {
      title: t('experience.items.acke.title'),
      company: t('experience.items.acke.company'),
      location: t('experience.items.acke.location'),
      period: t('experience.items.acke.period'),
      type: t('experience.types.contractor'),
      description: getDescription('experience.items.acke.description')
    },
    {
      title: t('experience.items.solution404.title'),
      company: t('experience.items.solution404.company'),
      location: t('experience.items.solution404.location'),
      period: t('experience.items.solution404.period'),
      type: t('experience.types.full-time'),
      description: getDescription('experience.items.solution404.description')
    }
  ];

  return (
    <section id="experience" className="py-20">
      <div className="container-custom">
        <SectionHeading 
          title={t('experience.title')} 
          subtitle={t('experience.subtitle')}
        />
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
          
          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -top-1.5 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-dark-200 z-10 max-md:ml-[-7px]"></div>
                
                {/* Date and Type */}
                <div className={`md:w-1/2 pb-8 md:pb-0 pl-16 md:pl-0 ${
                  index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'
                }`}>
                  <div className={`flex flex-col ${
                    index % 2 === 0 ? 'md:items-start' : 'md:items-end'
                  }`}>
                    <div className={`flex items-center space-x-2 mb-2 ${
                      index % 2 === 0 ? '' : 'md:flex-row-reverse md:space-x-reverse'
                    }`}>
                      <Calendar size={16} className="text-primary-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-400 font-medium">
                        {exp.period}
                      </span>
                    </div>
                    <span className="badge badge-primary capitalize w-fit">
                      {exp.type}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className={`md:w-1/2 pl-16 md:pl-0 ${
                  index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                }`}>
                  <div className="card">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="text-primary-600 dark:text-primary-400" size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-primary-600 dark:text-primary-400 font-medium">
                          {exp.company}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                          {exp.location}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mt-4">
                      {exp.description.map((item, i) => (
                        <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary-500 mt-1.5 mr-2 flex-shrink-0"></span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;