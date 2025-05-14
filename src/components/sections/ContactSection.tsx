import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import SectionHeading from "../shared/SectionHeading";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const form = useRef<HTMLFormElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (!import.meta.env.VITE_EMAILJS_SERVICE_ID) {
      console.warn("Missing EmailJS Service ID in environment variables");
    }
    if (!import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
      console.warn("Missing EmailJS Template ID in environment variables");
    }
    if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
      console.warn("Missing EmailJS Public Key in environment variables");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      setSubmitStatus({
        success: false,
        message: t("contact.form.fillAllFields") || "Please fill in all fields",
      });

      setTimeout(() => {
        setSubmitStatus(null);
      }, 2000);

      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || "";
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "";

    if (form.current) {
      emailjs
        .sendForm(serviceId, templateId, form.current, publicKey)
        .then((result) => {
          console.log("Email uspješno poslan!", result.text);
          setSubmitStatus({
            success: true,
            message:
              t("contact.form.successMessage") || "Message sent successfully!",
          });

          setName("");
          setEmail("");
          setMessage("");

          setTimeout(() => {
            setSubmitStatus(null);
          }, 2000);
        })
        .catch((error) => {
          console.error("Greška pri slanju:", error.text);
          setSubmitStatus({
            success: false,
            message:
              t("contact.form.errorMessage") ||
              "Failed to send message. Please try again.",
          });

          setTimeout(() => {
            setSubmitStatus(null);
          }, 2000);
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-50 dark:bg-dark-100">
      <div className="container-custom">
        <SectionHeading
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
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
              {t("contact.letsGetInTouch")}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              {t("contact.description")}
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4">
                  <Mail
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    {t("contact.form.email")}
                  </h4>
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
                  <Linkedin
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    LinkedIn
                  </h4>
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
                  <Github
                    className="text-primary-600 dark:text-primary-400"
                    size={20}
                  />
                </div>
                <div>
                  <h4 className="text-sm text-slate-500 dark:text-slate-400">
                    GitHub
                  </h4>
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
              {t("contact.sendMessage")}
            </h3>

            <form ref={form} className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="user_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-dark-100 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t("contact.form.namePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="user_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-dark-100 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder={t("contact.form.emailPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  {t("contact.form.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-dark-100 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder={t("contact.form.messagePlaceholder")}
                ></textarea>
              </div>

              {submitStatus && (
                <div
                  className={`p-3 rounded-md ${
                    submitStatus.success
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitStatus.message}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("contact.form.sending") || "Sending..."
                  : t("contact.form.sendButton")}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
