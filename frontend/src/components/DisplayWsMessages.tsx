import React from "react"
import { Message } from "../types"

type WsMessagesProps = {
	messages: Message[]
}

const DisplayWsMessages: React.FC<WsMessagesProps> = ({ messages }) => {
	return (
		<div className="card">
			<h2 className="section-title">Received Messages</h2>
			<ul>
				{messages.map((msg, index) => (
					<li key={index} className="list-item">
						<p className="list-item-text">
							<strong>Type:</strong> {msg.type}
						</p>
						<p className="list-item-text">
							<strong>Session ID:</strong> {msg.sessionId}
						</p>
						<p className="list-item-text">
							<strong>Lobby ID:</strong> {msg.lobbyId}
						</p>
						<p className="list-item-text">
							<strong>Data:</strong> {msg.data}
						</p>
					</li>
				))}
			</ul>
		</div>
	)
}

export default DisplayWsMessages
