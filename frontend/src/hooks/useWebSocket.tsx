import { useEffect, useState } from 'react';
import { Message, MessageType } from '../types';

const WS_URL = import.meta.env.VITE_WS_BASE_URL;

export function useWebSocket() {
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [message, setMessage] = useState<Message | null>(null);

	useEffect(() => {
		const socket = new WebSocket(WS_URL);
		setWs(socket);

		socket.onmessage = (event) => {
			const data: Message = JSON.parse(event.data);
			setMessage(data);
		};

		socket.onopen = () => {
			console.log('Connected to WebSocket server');
		};

		socket.onclose = () => {
			console.log('WebSocket connection closed');
		};

		socket.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		return () => {
			socket.close();
		};
	}, [WS_URL]);

	const sendMessage = (
		type: MessageType,
		lobbyId: string,
		sessionId?: string,
		data?: any
	) => {
		if (ws && ws.readyState === WebSocket.OPEN) {
			const message: Message = { type, lobbyId, sessionId, data };
			ws.send(JSON.stringify(message));
		} else {
			console.error('WebSocket is not connected');
		}
	};

	return { message, sendMessage };
}
