import React from 'react'
import LobbyForm from '../components/LobbyForm'

const IndexPage: React.FC = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
			<h1 className="text-4xl font-bold mb-6 text-blue-400">
				Welcome to the Lobby
			</h1>
			<LobbyForm />
		</div>
	)
}

export default IndexPage
