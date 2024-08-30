import React from 'react'

export type StartButtonProps = {
	role: string | null
	handleStart: () => void
}

const StartButton: React.FC<StartButtonProps> = ({ role, handleStart }) => {
	if (role !== 'leader') {
		return null
	}

	return (
		<button
			onClick={handleStart}
			className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition"
		>
			Start
		</button>
	)
}

export default StartButton
