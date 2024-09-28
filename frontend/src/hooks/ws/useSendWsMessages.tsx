import { useCallback } from "react"
import { useWebSocketContext } from "../../context/webSocketContext"
import { Message } from "../../types"

export const useSendWsMessages = () => {
	const { socket } = useWebSocketContext()

	const sendMessage = useCallback(
		(message: Message) => {
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify(message))
			} else {
				console.warn("WebSocket is not open. Unable to send message.")
			}
		},
		[socket]
	)

	return { sendMessage }
}
