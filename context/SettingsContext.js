import React, { createContext, useState, useContext } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showTafsir, setShowTafsir] = useState(true);

  return (
    <SettingsContext.Provider
      value={{
        darkMode,
        setDarkMode,
        showUrdu,
        setShowUrdu,
        showEnglish,
        setShowEnglish,
        showTafsir,
        setShowTafsir,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
