import React from "react";
import { motion } from "framer-motion";
import SectionHeading from "../shared/SectionHeading";
import { useTranslation } from "react-i18next";

interface SkillCategory {
  name: string;
  skills: string[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Programming Languages",
    skills: ["JavaScript", "TypeScript (ES6+)"],
  },
  {
    name: "Frameworks & Libraries",
    skills: [
      "React",
      "React Native",
      "Next.js",
      "Vue 3",
      "MUI",
      "ChakraUI",
      "Styled Components",
      "Tailwind CSS",
      "shadcn/ui",
      "Vuetify",
    ],
  },
  {
    name: "State Management",
    skills: ["Redux Toolkit", "Zustand", "React Query", "Formik", "Vuex"],
  },
  {
    name: "Backend Technologies",
    skills: [
      "Python (Flask)",
      "PHP (Laravel)",
      "Node.js",
      "Express",
      "RESTful APIs",
      "GraphQL",
      "Microsoft SharePoint",
    ],
  },
  {
    name: "Databases",
    skills: [
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Firebase",
      "Supabase",
      "SQLite",
    ],
  },
  {
    name: "Version Control & Collaboration",
    skills: ["Git (GitHub, GitLab)", "Bitbucket", "Jira", "Figma", "Sketch"],
  },
  {
    name: "Additional Skills",
    skills: ["CI/CD pipelines", "Docker"],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const SkillsSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="skills" className="py-20 bg-slate-50 dark:bg-dark-100">
      <div className="container-custom">
        <SectionHeading
          title={t("skills.title")}
          subtitle={t("skills.subtitle")}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {skillCategories.map((category, index) => (
            <motion.div key={index} className="card h-full" variants={item}>
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
      </div>
    </section>
  );
};

export default SkillsSection;
