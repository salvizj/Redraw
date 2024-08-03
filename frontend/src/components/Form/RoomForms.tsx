// MainComponent.tsx
import axios from 'axios';
import React, { useState } from 'react';
import CreateRoomForm from './CreateRoomForm';
import JoinRoomForm from './JoinRoomForm';
import Button from '../Button/Button';

const MainComponent: React.FC = () => {
	const [playerStatus, setPlayerStatus] = useState<'admin' | 'player'>(
		'admin'
	);

	const handleCreateRoom = async (data: { username: string }) => {
		try {
			const response = await axios.post(
				'http://localhost:8080/create-room',
				data
			);
			console.log('Create room response:', response.data);
		} catch (error) {
			console.error('Error creating room:', error);
		}
	};

	const handleJoinRoom = async (data: {
		username: string;
		roomId: string;
	}) => {
		try {
			const response = await axios.post(
				'http://localhost:8080/join-room',
				data
			);
			console.log('Join room response:', response.data);
		} catch (error) {
			console.error('Error joining room:', error);
		}
	};

	return (
		<div>
			{playerStatus === 'admin' ? (
				<CreateRoomForm onSubmit={handleCreateRoom} />
			) : (
				<JoinRoomForm onSubmit={handleJoinRoom} />
			)}
			<Button
				onClick={() =>
					setPlayerStatus(
						playerStatus === 'admin' ? 'player' : 'admin'
					)
				}
			>
				Switch to{' '}
				{playerStatus === 'admin' ? 'Join Room' : 'Create Room'}
			</Button>
		</div>
	);
};

export default MainComponent;
