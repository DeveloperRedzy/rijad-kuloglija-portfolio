import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Mail,
  Briefcase,
  GraduationCap,
  Languages,
} from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import { useTranslation } from "react-i18next";

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="about" className="py-20 bg-slate-50 dark:bg-dark-100">
      <div className="container-custom">
        <SectionHeading
          title={t("about.title")}
          subtitle={t("about.subtitle")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-slate-800 dark:text-white">
              {t("about.whoIAm")}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t("about.whoIAmText1")}
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t("about.whoIAmText2")}
            </p>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {t("about.whoIAmText3")}
            </p>
            <p className="text-slate-600 dark:text-slate-300">
              {t("about.whoIAmText4")}
            </p>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-dark-200 rounded-lg shadow-md p-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-white">
              {t("about.personalInfo")}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <MapPin
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    {t("about.location")}
                  </h4>
                  <p className="text-slate-800 dark:text-white">
                    {t("about.locationValue")}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Mail
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    {t("about.email")}
                  </h4>
                  <p className="text-slate-800 dark:text-white">
                    {t("about.emailValue")}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Briefcase
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    {t("about.currentPosition")}
                  </h4>
                  <p className="text-slate-800 dark:text-white">
                    {t("about.currentPositionValue")}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <GraduationCap
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    {t("about.education")}
                  </h4>
                  <p className="text-slate-800 dark:text-white">
                    {t("about.educationValue")}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Languages
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    {t("about.languages")}
                  </h4>
                  <p className="text-slate-800 dark:text-white">
                    {t("about.languagesValue")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
