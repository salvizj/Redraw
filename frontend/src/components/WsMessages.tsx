import React from 'react'
import { Message } from '../types'

type WsMessagesProps = {
	messages: Message[]
}

const WsMessages: React.FC<WsMessagesProps> = ({ messages }) => (
	<div>
		<h2>Received Messages</h2>
		<ul>
			{messages.map((msg, index) => (
				<li key={index}>
					<strong>Type:</strong> {msg.type} <br />
					<strong>Session ID:</strong> {msg.sessionId} <br />
					<strong>Lobby ID:</strong> {msg.lobbyId} <br />
					<strong>Data:</strong> {msg.data} <br />
				</li>
			))}
		</ul>
	</div>
)

export default WsMessages
