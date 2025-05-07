import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import { useTranslation } from "react-i18next";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  detailedDescription?: string;
}

const projects: Project[] = [
  {
    title: "ultimateDashboard",
    description: "ultimateDashboard",
    technologies: ["Vue 3", "Vuex", "Vuetify", "PHP Laravel", "MySQL"],
    detailedDescription: "ultimateDashboard",
  },
  {
    title: "feedbackPro",
    description: "feedbackPro",
    technologies: ["Python Flask", "Bootstrap 5", "SQLite"],
    detailedDescription: "feedbackPro",
  },
  {
    title: "memberGetMember",
    description: "memberGetMember",
    technologies: ["Python Flask", "Bootstrap 5", "SQLite"],
    detailedDescription: "memberGetMember",
  },
  {
    title: "bloolaCM",
    description: "bloolaCM",
    technologies: [
      "React",
      "TypeScript",
      "Microsoft Teams API",
      "SharePoint",
      "Material UI",
      "Styled Components",
    ],
    detailedDescription: "bloolaCM",
  },
  {
    title: "bloolaFactory",
    description: "bloolaFactory",
    technologies: [
      "React",
      "JavaScript",
      "Redux Toolkit",
      "SharePoint",
      "Material UI",
      "Styled Components",
    ],
    detailedDescription: "bloolaFactory",
  },
  {
    title: "projectPlanner",
    description: "projectPlanner",
    technologies: [
      "React",
      "SharePoint",
      "Material UI",
      "Custom Components",
      "Redux Toolkit",
    ],
    detailedDescription: "projectPlanner",
  },
  {
    title: "travelApp",
    description: "travelApp",
    technologies: [
      "React",
      "Zustand",
      "Material UI",
      "Google Maps API",
      "Chart.js",
      "Redux Toolkit",
    ],
    detailedDescription: "travelApp",
  },
  {
    title: "bmwLearningFinder",
    description: "bmwLearningFinder",
    technologies: [
      "React",
      "TypeScript",
      "SharePoint",
      "Redux Toolkit",
      "TypeScript",
    ],
    detailedDescription: "bmwLearningFinder",
  },
  {
    title: "bdmNetwork",
    description: "bdmNetwork",
    technologies: ["MongoDB", "Express", "React", "Node.js"],
    detailedDescription: "bdmNetwork",
  },
];

const ProjectsSection: React.FC = () => {
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
  const { t } = useTranslation();

  const toggleExpand = (index: number) => {
    setExpandedProjects((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

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

  return (
    <section id="projects" className="py-20">
      <div className="container-custom">
        <SectionHeading
          title={t("projects.title")}
          subtitle={t("projects.subtitle")}
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="card h-full flex flex-col"
              variants={item}
            >
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-white">
                  {t(`projects.items.${project.title}.title`)}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {t(`projects.items.${project.title}.description`)}
                </p>

                {expandedProjects.includes(index) &&
                  project.detailedDescription && (
                    <div className="mt-2 mb-4 text-slate-600 dark:text-slate-400 text-sm">
                      <p>
                        {t(
                          `projects.items.${project.title}.detailedDescription`,
                        )}
                      </p>
                    </div>
                  )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-400 rounded text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {project.detailedDescription && (
                <button
                  onClick={() => toggleExpand(index)}
                  className="mt-auto flex items-center justify-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  {expandedProjects.includes(index) ? (
                    <>
                      <span>{t("projects.showLess")}</span>
                      <ChevronUp size={16} className="ml-1" />
                    </>
                  ) : (
                    <>
                      <span>{t("projects.showMore")}</span>
                      <ChevronDown size={16} className="ml-1" />
                    </>
                  )}
                </button>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-slate-600 dark:text-slate-300 mb-6"
          >
            {t("projects.description")}
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            href="https://github.com/DeveloperRedzy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center btn-primary"
          >
            <span>{t("projects.viewMore")}</span>
            <ExternalLink size={16} className="ml-2" />
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
