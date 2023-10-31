import React, { createContext, useState } from "react";

interface GlobalProps {
  searchInput: string | null;
  setSearchInput: React.Dispatch<React.SetStateAction<string | null>>;
}

export const GlobalContext = createContext<GlobalProps | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchInput, setSearchInput] = useState<string | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        searchInput,
        setSearchInput,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
