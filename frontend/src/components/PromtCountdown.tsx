import React, { useEffect, useState } from 'react'

type PromtCountdownProps = {
	initialCounter: number
	onCountdownComplete: () => void
}

export const PromtCountdown: React.FC<PromtCountdownProps> = ({
	initialCounter,
	onCountdownComplete,
}) => {
	const [counter, setCounter] = useState(initialCounter)

	useEffect(() => {
		const countdownInterval = setInterval(() => {
			setCounter((prevCounter) => {
				if (prevCounter <= 1) {
					clearInterval(countdownInterval)
					onCountdownComplete()
					return 0
				}
				return prevCounter - 1
			})
		}, 1000)

		return () => clearInterval(countdownInterval)
	}, [onCountdownComplete])

	return (
		<h2 className="text-2xl mb-4">
			Enter your prompt: {counter} seconds left
		</h2>
	)
}
