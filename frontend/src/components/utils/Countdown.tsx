import React, { useEffect, useRef, useState } from "react"

type CountdownProps = {
	text: string
	initialCounter: number
	onCountdownComplete: () => void
}

export const Countdown: React.FC<CountdownProps> = ({
	text,
	initialCounter,
	onCountdownComplete,
}) => {
	const [counter, setCounter] = useState(initialCounter)
	const counterRef = useRef(initialCounter)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		const startCountdown = () => {
			intervalRef.current = setInterval(() => {
				counterRef.current -= 1
				setCounter(counterRef.current)

				if (counterRef.current <= 0) {
					if (intervalRef.current) clearInterval(intervalRef.current)
					onCountdownComplete()
				}
			}, 1000)
		}

		startCountdown()

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
		}
	}, [onCountdownComplete])

	return (
		<h2>
			{text} {counter} seconds left
		</h2>
	)
}
