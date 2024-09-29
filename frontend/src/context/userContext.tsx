import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserContextType } from "../types";

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  return (
    <UserContext.Provider
      value={{
        username,
        role,
        sessionId,
        setUsername,
        setRole,
        setSessionId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContext };
