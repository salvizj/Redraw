import React from "react"

export type LobbyStartButtonProps = {
	role: string | null
	playerCount: number
	handleStart: () => void
}

const LobbyStartButton: React.FC<LobbyStartButtonProps> = ({
	role,
	playerCount,
	handleStart,
}) => {
	const isLeader = role === "leader"
	const moreThanOnePlayer = playerCount > 1
	const isDisabled = !isLeader || !moreThanOnePlayer

	const buttonText = isLeader
		? moreThanOnePlayer
			? "Start"
			: "Not enough players to start"
		: "Waiting for leader"

	return (
		<div className="flex justify-center items-center">
			<button
				onClick={handleStart}
				disabled={isDisabled}
				className={`flex justify-center bg-primary-light dark:bg-primary-dark text-white px-6 py-4 rounded-full font-bold text-xl transition-colors duration-300 ${
					isDisabled
						? "cursor-not-allowed opacity-50"
						: "hover:bg-primary-dark dark:hover:bg-primary-light"
				}`}
			>
				{buttonText}
			</button>
		</div>
	)
}

export default LobbyStartButton
