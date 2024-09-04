import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LobbyProvider } from "./context/lobbyContext";
import { UserProvider } from "./context/userContext";
import IndexPage from "./pages/IndexPage";
import LobbyPage from "./pages/LobbyPage";
import { WebSocketProvider } from "./context/webSocketContext";

const App: React.FC = () => {
  return (
    <Router>
      <UserProvider>
        <LobbyProvider>
          <WebSocketProvider>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/lobby" element={<LobbyPage />} />
            </Routes>
          </WebSocketProvider>
        </LobbyProvider>
      </UserProvider>
    </Router>
  );
};

export default App;
