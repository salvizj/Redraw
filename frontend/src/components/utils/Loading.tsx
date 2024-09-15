import React from "react"

interface LoadingProps {
	messages: string[]
}

const Loading: React.FC<LoadingProps> = ({ messages }) => (
	<div
		className={`bg-secondary-light dark:bg-secondary-dark p-6 rounded-full text-center }`}
	>
		{messages.map((message, index) => (
			<p
				key={index}
				className="text-text-light dark:text-text-dark text-lg font-semibold mb-2"
			>
				{message}
			</p>
		))}
	</div>
)

export default Loading
