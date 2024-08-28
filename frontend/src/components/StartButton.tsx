import React from 'react'
import { StartButtonProps } from '../types'

const StartButton: React.FC<StartButtonProps> = ({ role, handleStart }) => {
	if (role !== 'leader') {
		return null
	}

	return <button onClick={handleStart}>Start</button>
}

export default StartButton
