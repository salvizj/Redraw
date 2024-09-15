import React from "react"
import LobbyForm from "../components/lobby/LobbyForm"

const IndexPage: React.FC = () => {
	return (
		<div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col items-center justify-center p-6">
			<h1 className="text-5xl font-bold mb-8 text-primary-light dark:text-primary-dark uppercase animate-bounce">
				Redraw
			</h1>
			<LobbyForm />
		</div>
	)
}

export default IndexPage
