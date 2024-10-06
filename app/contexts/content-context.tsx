"use client";

import React, { createContext, useContext, useState } from "react";

interface ContentContextType {
  shouldRefresh: boolean;
  setShouldRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refreshSidebar: () => void;
  deletedItem: string | null;
  setDeletedItem: React.Dispatch<React.SetStateAction<string | null>>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [deletedItem, setDeletedItem] = useState<string | null>(null);

  const refreshSidebar = () => {
    setShouldRefresh(true);
  };

  return (
    <ContentContext.Provider
      value={{ shouldRefresh, setShouldRefresh, refreshSidebar, deletedItem, setDeletedItem }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
}