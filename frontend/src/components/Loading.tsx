import React from 'react'

const Loading: React.FC = () => (
	<div className="text-center text-lg animate-pulse">
		<p className="mb-2">Connecting to the lobby...</p>
		<p className="mb-2">Gathering user details...</p>
		<p className="mb-2">Almost there...</p>
	</div>
)

export default Loading
