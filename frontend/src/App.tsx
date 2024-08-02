import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import AboutPage from './pages/AboutPage';

const App: React.FC = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<IndexPage />} />
				<Route path="/about" element={<AboutPage />} />
			</Routes>
		</Router>
	);
};

export default App;
