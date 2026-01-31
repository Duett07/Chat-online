"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AccountResType } from "./schemaValidations/account.schema";
import { isClient } from "@/lib/http";

type User = AccountResType["data"];

const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}>({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
});

export const useAppContext = () => useContext(AppContext);

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
  user?: User;
}) {
  const [user, setUserState] = useState<User | null>(() => {
    if (isClient()) {
      const _user = localStorage.getItem("user");
      return _user ? JSON.parse(_user) : null;
    }
    return null;
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const stored = localStorage.getItem("user");
    if (stored) {
      setUserState(JSON.parse(stored));
    }
  }, []);

  const isAuthenticated = Boolean(user);
  const setUser = (user: User | null) => {
    setUserState(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  if (!mounted) {
    return null;
  }


  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AppContext.Provider>
  );
}
