import React, { createContext, useState, useContext } from "react";

// Define translation data
const translations = {
  en: {
    welcome: "Welcome",
    searchPlaceholder: "Search tasks...",
    addTaskPlaceholder: "Enter a new task...",
    tagPlaceholder: "Tag (optional)",
    addButton: "Add",
    createdOn: "Created on",
    completed: "Completed",
    share: "Share",
    delete: "Delete",
    logout: "Logout",
  },
  hi: {
    welcome: "स्वागत है",
    searchPlaceholder: "कार्य खोजें...",
    addTaskPlaceholder: "नया कार्य दर्ज करें...",
    tagPlaceholder: "टैग (वैकल्पिक)",
    addButton: "जोड़ें",
    createdOn: "बनाया गया",
    completed: "पूरा हुआ",
    share: "साझा करें",
    delete: "हटाएं",
    logout: "लॉग आउट",
  },
};

// Create a Context
const LanguageContext = createContext();

// Custom Hook for Language Access
export const useLanguage = () => useContext(LanguageContext);

// Provider Component
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, translations, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
