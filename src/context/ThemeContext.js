import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService from '../services/StorageService';

const lightTheme = {
  mode: 'light',
  background: '#F4F5F7',
  card: '#FFFFFF',
  textPrimary: '#172B4D',
  textSecondary: '#5E6C84',
  border: '#EBECF0',
  primary: '#0052cc',
  success: '#00875A',
  danger: '#DE350B',
  warning: '#FF991F',
  overlay: 'rgba(9, 30, 66, 0.54)',
  tabBar: '#FFFFFF',
  tabBarInactive: '#8c98a9',
};

const darkTheme = {
  mode: 'dark',
  background: '#091E42', // Deep navy
  card: '#172B4D', // Slate card
  textPrimary: '#FFFFFF', // Bright white text
  textSecondary: '#A5ADBA', // Soft gray text
  border: '#253858', // Dark border
  primary: '#4C9AFF', // Brighter blue for dark mode visibility
  success: '#36B37E', // Brighter green
  danger: '#FF5630', // Brighter red
  warning: '#FFAB00', // Brighter orange
  overlay: 'rgba(0, 0, 0, 0.7)',
  tabBar: '#172B4D',
  tabBarInactive: '#5E6C84',
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await StorageService.getTheme();
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
      }
      setIsReady(true);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await StorageService.saveTheme(newMode ? 'dark' : 'light');
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme, isThemeReady: isReady }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
