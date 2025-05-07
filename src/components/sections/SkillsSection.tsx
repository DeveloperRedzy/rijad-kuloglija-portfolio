import React from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../shared/SectionHeading';
import { useTranslation } from 'react-i18next';

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Programming Languages',
    skills: ['JavaScript', 'TypeScript (ES6+)']
  },
  {
    name: 'Frameworks & Libraries',
    skills: ['React', 'React Native', 'Next.js', 'Vue 3', 'MUI', 'Styled Components', 'ChakraUI', 'Tailwind CSS', 'shadcn/ui', 'Vuetify']
  },
  {
    name: 'State Management',
    skills: ['Redux Toolkit', 'Zustand', 'React Query', 'Formik', 'Vuex']
  },
  {
    name: 'Backend Technologies',
    skills: ['Python (Flask)', 'PHP (Laravel)', 'Node.js', 'Express', 'RESTful APIs', 'GraphQL', 'Microsoft SharePoint']
  },
  {
    name: 'Databases',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Firebase', 'Supabase', 'SQLite']
  },
  {
    name: 'Version Control & Collaboration',
    skills: ['Git (GitHub, GitLab)', 'Bitbucket', 'Jira', 'Figma', 'Sketch']
  },
  {
    name: 'Additional Skills',
    skills: ['CI/CD pipelines', 'Docker']
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const SkillsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-dark-100">
      <div className="container-custom">
        <SectionHeading 
          title={t('skills.title')} 
          subtitle={t('skills.subtitle')}
        />
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, index) => (
            <motion.div 
              key={index}
              className="card h-full"
              variants={item}
            >
              <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-700">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <span 
                    key={i}
                    className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-16">
          <h3 className="text-xl font-semibold mb-6 text-center text-slate-800 dark:text-white">
            {t('skills.languages')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="font-medium mb-2 text-slate-800 dark:text-white">English</h4>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{t('skills.professional')}</p>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h4 className="font-medium mb-2 text-slate-800 dark:text-white">German</h4>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{t('skills.intermediate')}</p>
            </motion.div>
            
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <h4 className="font-medium mb-2 text-slate-800 dark:text-white">Bosnian / Serbian / Croatian</h4>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{t('skills.native')}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;