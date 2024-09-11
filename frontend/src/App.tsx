import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LobbyProvider } from './context/lobbyContext'
import { UserProvider } from './context/userContext'
import IndexPage from './pages/IndexPage'
import LobbyPage from './pages/LobbyPage'
import { WebSocketProvider } from './context/webSocketContext'
import GamePage from './pages/GamePage'
import ShowcasePage from './pages/ShowcasePage'

const App: React.FC = () => {
	return (
		<Router>
			<UserProvider>
				<LobbyProvider>
					<WebSocketProvider>
						<Routes>
							<Route path="/" element={<IndexPage />} />
							<Route path="/lobby" element={<LobbyPage />} />
							<Route path="/game" element={<GamePage />} />
							<Route
								path="/showcase"
								element={<ShowcasePage />}
							/>
						</Routes>
					</WebSocketProvider>
				</LobbyProvider>
			</UserProvider>
		</Router>
	)
}

export default App
