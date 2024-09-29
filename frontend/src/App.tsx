import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LobbyProvider } from "./context/lobbyContext";
import { UserProvider } from "./context/userContext";
import IndexPage from "./pages/IndexPage";
import LobbyPage from "./pages/LobbyPage";
import { WebSocketProvider } from "./context/webSocketContext";
import GamePage from "./pages/GamePage";
import ShowcasePage from "./pages/GuessingPage";
import { ThemeProvider } from "./context/themeContext";
import Layout from "../src/components/utils/Layout";
import { LanguageProvider } from "./context/languageContext";
import GuessingPage from "./pages/GuessingPage";
import { GameStateProvider } from "./context/gameStateContext";

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <UserProvider>
            <LobbyProvider>
              <WebSocketProvider>
                <GameStateProvider>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<IndexPage />} />
                      <Route path="lobby" element={<LobbyPage />} />
                      <Route path="game" element={<GamePage />} />
                      <Route path="guessing" element={<GuessingPage />} />
                      <Route path="showcase" element={<ShowcasePage />} />
                    </Route>
                  </Routes>
                </GameStateProvider>
              </WebSocketProvider>
            </LobbyProvider>
          </UserProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
