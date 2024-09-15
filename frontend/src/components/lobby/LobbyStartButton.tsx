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
		<button
			onClick={handleStart}
			disabled={isDisabled}
			className={`btn btn-primary ${
				isLeader && moreThanOnePlayer
					? "bg-primary btn"
					: "bg-disabled btn "
			}`}
		>
			{buttonText}
		</button>
	)
}

export default LobbyStartButton
