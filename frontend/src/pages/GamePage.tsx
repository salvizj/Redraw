import React from 'react';
import { useGameContext } from '../context/gameContext';
import Canvas from '../components/Canvas';
import Chat from '../components/Chat';

const GamePage: React.FC = () => {
	const { canvasState, updateCanvasState } = useGameContext();

	return (
		<div>
			<h1>Game Page</h1>
			<Canvas
				canvasState={canvasState}
				updateCanvasState={updateCanvasState}
			/>
			<Chat />
		</div>
	);
};

export default GamePage;
