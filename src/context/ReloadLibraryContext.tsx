import React, { createContext, useState, useContext } from 'react';

interface ReloadLibraryContextType {
  reloadLibrary: boolean;
  setReloadLibrary: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReloadLibraryContext = createContext<ReloadLibraryContextType>({
  reloadLibrary: false,
  setReloadLibrary: () => {},
});

export const useReloadLibrary = () => useContext(ReloadLibraryContext);

export const ReloadLibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reloadLibrary, setReloadLibrary] = useState<boolean>(false);

  return (
    <ReloadLibraryContext.Provider value={{ reloadLibrary, setReloadLibrary }}>
      {children}
    </ReloadLibraryContext.Provider>
  );
};
