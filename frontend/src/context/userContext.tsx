import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserContextType = {
  username: string | null;
  sessionId: string | null;
  role: string | null;
  setSessionId: (sessionId: string | null) => void;
  setUsername: (username: string | null) => void;
  setRole: (role: string | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

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
