import React from "react"

type ErrorMessageProps = {
	message?: string | null
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
	if (!message) return null

	return <p className="error-text">Error: {message}</p>
}

export default ErrorMessage
