import React, { createContext, useState } from "react";

interface GlobalProps {
  searchInput: string | null;
  setSearchInput: React.Dispatch<React.SetStateAction<string | null>>;
  platform: number | null;
  setPlatform: React.Dispatch<React.SetStateAction<number | null>>;
  sort: string;
  setSort: React.Dispatch<React.SetStateAction<string>>;
  dateRelesed: string;
  setDateRelesed: React.Dispatch<React.SetStateAction<string>>;
  genre: string | null;
  setGenre: React.Dispatch<React.SetStateAction<string | null>>;
}

export const GlobalContext = createContext<GlobalProps | undefined>(undefined);

export const GlobalContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [searchInput, setSearchInput] = useState<string | null>(null);
  const [platform, setPlatform] = useState<number | null>(null);
  const [sort, setSort] = useState<string>("");
  const [dateRelesed, setDateRelesed] = useState<string>("");
  const [genre, setGenre] = useState<string | null>(null);

  return (
    <GlobalContext.Provider
      value={{
        searchInput,
        setSearchInput,
        setPlatform,
        platform,
        sort,
        setSort,
        dateRelesed,
        setDateRelesed,
        genre,
        setGenre,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
