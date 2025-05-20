import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import { useTranslation } from "react-i18next";

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
      title: t("experience.items.procredit.title"),
      company: t("experience.items.procredit.company"),
      location: t("experience.items.procredit.location"),
      period: t("experience.items.procredit.period"),
      type: t("experience.types.full-time"),
      description: getDescription("experience.items.procredit.description"),
    },
    {
      title: t("experience.items.arkona.title"),
      company: t("experience.items.arkona.company"),
      location: t("experience.items.arkona.location"),
      period: t("experience.items.arkona.period"),
      type: t("experience.types.part-time"),
      description: getDescription("experience.items.arkona.description"),
    },
    {
      title: t("experience.items.superlex.title"),
      company: t("experience.items.superlex.company"),
      location: t("experience.items.superlex.location"),
      period: t("experience.items.superlex.period"),
      type: t("experience.types.contractor"),
      description: getDescription("experience.items.superlex.description"),
    },
    {
      title: t("experience.items.bloola.title"),
      company: t("experience.items.bloola.company"),
      location: t("experience.items.bloola.location"),
      period: t("experience.items.bloola.period"),
      type: t("experience.types.contractor"),
      description: getDescription("experience.items.bloola.description"),
    },
    {
      title: t("experience.items.acke.title"),
      company: t("experience.items.acke.company"),
      location: t("experience.items.acke.location"),
      period: t("experience.items.acke.period"),
      type: t("experience.types.contractor"),
      description: getDescription("experience.items.acke.description"),
    },
    {
      title: t("experience.items.solution404.title"),
      company: t("experience.items.solution404.company"),
      location: t("experience.items.solution404.location"),
      period: t("experience.items.solution404.period"),
      type: t("experience.types.full-time"),
      description: getDescription("experience.items.solution404.description"),
    },
  ];

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Original waves */}
          <motion.path
            d="M0,50 Q25,40 50,50 T100,50"
            fill="none"
            stroke="rgba(59, 130, 246, 0.1)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.path
            d="M0,60 Q25,70 50,60 T100,60"
            fill="none"
            stroke="rgba(59, 130, 246, 0.15)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5,
            }}
          />
          <motion.path
            d="M0,40 Q25,30 50,40 T100,40"
            fill="none"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1,
            }}
          />
          <motion.path
            d="M0,30 Q25,20 50,30 T100,30"
            fill="none"
            stroke="rgba(59, 130, 246, 0.12)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.3,
            }}
          />
          <motion.path
            d="M0,70 Q25,80 50,70 T100,70"
            fill="none"
            stroke="rgba(59, 130, 246, 0.18)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.7,
            }}
          />
          <motion.path
            d="M0,20 Q25,10 50,20 T100,20"
            fill="none"
            stroke="rgba(59, 130, 246, 0.08)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.2,
            }}
          />
          <motion.path
            d="M0,80 Q25,90 50,80 T100,80"
            fill="none"
            stroke="rgba(59, 130, 246, 0.14)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.7,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.9,
            }}
          />

          {/* Additional interweaving lines */}
          <motion.path
            d="M0,45 Q25,35 50,45 T100,45"
            fill="none"
            stroke="rgba(59, 130, 246, 0.09)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.3,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.4,
            }}
          />
          <motion.path
            d="M0,55 Q25,65 50,55 T100,55"
            fill="none"
            stroke="rgba(59, 130, 246, 0.11)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.6,
            }}
          />
          <motion.path
            d="M0,35 Q25,25 50,35 T100,35"
            fill="none"
            stroke="rgba(59, 130, 246, 0.13)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.9,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.8,
            }}
          />
          <motion.path
            d="M0,65 Q25,75 50,65 T100,65"
            fill="none"
            stroke="rgba(59, 130, 246, 0.16)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.1,
            }}
          />
          <motion.path
            d="M0,25 Q25,15 50,25 T100,25"
            fill="none"
            stroke="rgba(59, 130, 246, 0.07)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 3.1,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.3,
            }}
          />
          <motion.path
            d="M0,75 Q25,85 50,75 T100,75"
            fill="none"
            stroke="rgba(59, 130, 246, 0.17)"
            strokeWidth="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1.0,
            }}
          />
        </svg>
      </div>

      <div className="container-custom">
        <SectionHeading
          title={t("experience.title")}
          subtitle={t("experience.subtitle")}
        />

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 -top-1.5 w-4 h-4 rounded-full bg-primary-500 border-2 border-white dark:border-dark-200 z-10 max-md:ml-[-7px]"></div>

                {/* Date and Type */}
                <div
                  className={`md:w-1/2 pb-8 md:pb-0 pl-16 md:pl-0 ${
                    index % 2 === 0 ? "md:pl-12" : "md:pr-12"
                  }`}
                >
                  <div
                    className={`flex flex-col ${
                      index % 2 === 0 ? "md:items-start" : "md:items-end"
                    }`}
                  >
                    <div
                      className={`flex items-center space-x-2 mb-2 ${
                        index % 2 === 0
                          ? ""
                          : "md:flex-row-reverse md:space-x-reverse"
                      }`}
                    >
                      <Calendar
                        size={16}
                        className="text-primary-500 flex-shrink-0"
                      />
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
                <div
                  className={`md:w-1/2 pl-16 md:pl-0 ${
                    index % 2 === 0 ? "md:pr-12" : "md:pl-12"
                  }`}
                >
                  <div className="card">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                        <Briefcase
                          className="text-primary-600 dark:text-primary-400"
                          size={20}
                        />
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
                        <li
                          key={i}
                          className="text-slate-600 dark:text-slate-300 flex items-start"
                        >
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
