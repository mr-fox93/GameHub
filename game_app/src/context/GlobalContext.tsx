import React, { createContext, useState } from "react";

interface GlobalProps {
  searchInput: string | null;
  setSearchInput: React.Dispatch<React.SetStateAction<string | null>>;
  platform: number | null;
  setPlatform: React.Dispatch<React.SetStateAction<number | null>>;
}

export const GlobalContext = createContext<GlobalProps | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [platform, setPlatform] = useState<number | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        searchInput,
        setSearchInput,
        setPlatform,
        platform,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
