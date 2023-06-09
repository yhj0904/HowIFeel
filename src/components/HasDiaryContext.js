import React, { createContext, useState } from 'react';

const HasDiaryContext = createContext();

export function HasDiaryProvider({ children }) {
  const [hasDiary, setHasDiary] = useState(false);

  return (
    <HasDiaryContext.Provider value={{ hasDiary, setHasDiary }}>
      {children}
    </HasDiaryContext.Provider>
  );
}

export default HasDiaryContext;
