import { useState, useCallback, useEffect } from 'react';
import { Message, WsApi } from '../types';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const useWsApi = (): WsApi => {
	const [ws, setWs] = useState<WebSocket | null>(null);
	const [messageHandlers, setMessageHandlers] = useState<
		((msg: Message) => void)[]
	>([]);

	const connect = useCallback(
		(lobbyId: string) => {
			const socket = new WebSocket(`${BASE_URL}/ws?lobbyId=${lobbyId}`);

			socket.onopen = () => {
				console.log('WebSocket connection established');
			};

			socket.onmessage = (event) => {
				const message: Message = JSON.parse(event.data);
				messageHandlers.forEach((handler) => handler(message));
			};

			socket.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			socket.onclose = () => {
				console.log('WebSocket connection closed');
			};

			setWs(socket);
		},
		[messageHandlers]
	);

	const disconnect = useCallback(() => {
		if (ws) {
			ws.close();
			setWs(null);
		}
	}, [ws]);

	const sendMessage = useCallback(
		(msg: Message) => {
			if (ws) {
				ws.send(JSON.stringify(msg));
			}
		},
		[ws]
	);

	const onMessage = useCallback((callback: (msg: Message) => void) => {
		setMessageHandlers((prev) => [...prev, callback]);
	}, []);

	useEffect(() => {
		return () => {
			disconnect();
		};
	}, [disconnect]);

	return {
		connect,
		disconnect,
		sendMessage,
		onMessage,
	};
};

export default useWsApi;
