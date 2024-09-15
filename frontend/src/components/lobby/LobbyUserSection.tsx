import React from "react"

interface LobbyUserSectionProps {
	username: string
}

const LobbyUserSection: React.FC<LobbyUserSectionProps> = ({ username }) => (
	<>
		<p className="mb-2 text-xl">
			<span className="font-semibold text-text-light dark:text-text-dark">
				Username:
			</span>
			<span className="ml-2 text-text-light dark:text-text-dark">
				{username}
			</span>
		</p>
	</>
)

export default LobbyUserSection
