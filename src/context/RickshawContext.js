import React, { createContext, useState, useContext, useEffect } from 'react';
import StorageService from '../services/StorageService';

const RickshawContext = createContext();

export const RickshawProvider = ({ children }) => {
  const [myRickshaw, setMyRickshawState] = useState(null);

  useEffect(() => {
    // Load the saved rickshaw from local storage when the app first opens
    const loadSavedRickshaw = async () => {
      const saved = await StorageService.getMyRickshaw();
      if (saved) {
        setMyRickshawState(saved);
      }
    };
    loadSavedRickshaw();
  }, []);

  const setMyRickshaw = async (profile) => {
    // Update global state immediately
    setMyRickshawState(profile);
    // Persist to database in the background
    await StorageService.saveMyRickshaw(profile);
  };

  return (
    <RickshawContext.Provider value={{ myRickshaw, setMyRickshaw }}>
      {children}
    </RickshawContext.Provider>
  );
};

export const useRickshaw = () => useContext(RickshawContext);
