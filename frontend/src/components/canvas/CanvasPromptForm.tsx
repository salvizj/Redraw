/* eslint-disable react/display-name */
import React, { useState, forwardRef, useImperativeHandle } from "react"
import { createPrompt } from "../../api/prompt/createPromptApi"
import { useLanguage } from "../../context/languageContext"
import { CanavsPromptFormProps } from "../../types"

const CanvasPromptForm = forwardRef<
	{ handleForceSubmit: () => Promise<void> },
	CanavsPromptFormProps
>(({ sessionId, lobbyId, username, onPromptSent }, ref) => {
	const [inputValue, setInputValue] = useState<string>("")
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const { language } = useLanguage()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value)
	}

	const submitPrompt = async (forceSubmit: boolean = false) => {
		if (!sessionId || !lobbyId || !username) {
			setError(
				language === "en"
					? "Missing sessionId, lobbyId, or username."
					: "Trūkst sessijasId, istabasId, vai lietotājvārds"
			)
			return
		}

		const promptToSubmit =
			inputValue.trim() || (forceSubmit ? "default" : "")
		if (!promptToSubmit && !forceSubmit) {
			setError(
				language === "en"
					? "Prompt cannot be empty."
					: "Nosacījums nevar būt tukšs."
			)
			return
		}

		setLoading(true)
		setError(null)

		try {
			await createPrompt({
				prompt: promptToSubmit,
				sessionId,
				lobbyId,
				username,
			})
			setInputValue("")
			onPromptSent()
		} catch (error) {
			const errorMessage =
				language === "en"
					? "Failed to submit prompt. Please try again."
					: "Neizdevās iesniegt nosacījumu. Lūdzu mēģiniet atkārtoti."
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		await submitPrompt(false)
	}

	useImperativeHandle(ref, () => ({
		handleForceSubmit: async () => {
			await submitPrompt(true)
		},
	}))

	return (
		<div className="mb-6">
			<form
				onSubmit={handleSubmit}
				className="bg-background-light dark:bg-background-dark p-8 rounded-xl max-w-md mx-auto ring-4 ring-primary-light dark:ring-primary-dark"
			>
				<label className="block text-text-light dark:text-text-dark mb-2 text-xl font-bold">
					{language === "en" ? "Prompt:" : "Nosacījums:"}
					<input
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						placeholder={
							language === "en"
								? "Enter your prompt"
								: "Ievadiet savu nosacījumu"
						}
						disabled={loading}
						className="bg-secondary-light dark:bg-secondary-dark text-text-light dark:text-text-dark border-2 border-primary-light dark:border-primary-dark rounded-xl p-3 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
					/>
				</label>
				<button
					type="submit"
					disabled={loading || !!error}
					className={`px-6 py-3 rounded-full font-bold text-lg transition-colors duration-300 ${
						loading || error
							? "bg-secondary-light text-white cursor-not-allowed"
							: "bg-primary-light text-white hover:bg-primary-dark"
					}`}
				>
					{loading
						? "Submitting..."
						: language === "en"
						? "Submit"
						: "Iesniegt"}
				</button>
				{error && (
					<p className="text-red-500 mb-4 font-semibold">{error}</p>
				)}
			</form>
		</div>
	)
})

export default CanvasPromptForm
