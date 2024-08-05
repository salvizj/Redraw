import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LobbyPage from './pages/LobbyPage';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<IndexPage />} />
				<Route path="/lobby" element={<LobbyPage />} />
			</Routes>
		</Router>
	);
};

export default App;
