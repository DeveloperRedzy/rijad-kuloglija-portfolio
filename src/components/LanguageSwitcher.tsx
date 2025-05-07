import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "bs" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-dark-100"
      aria-label="Toggle language"
    >
      <Globe size={20} className="text-slate-700 dark:text-slate-200" />
    </button>
  );
};

export default LanguageSwitcher;
