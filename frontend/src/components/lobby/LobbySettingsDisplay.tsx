import React from "react"
import { LobbySettings } from "../../types"

type LobbySettingsDisplayProps = {
	role: string
	isEditing: boolean
	setIsEditing: (isEditing: boolean) => void
	maxPlayerCount: number
	setMaxPlayerCount: (count: number) => void
	promptInputTime: number
	setPromptInputTime: (time: number) => void
	drawingTime: number
	setDrawingTime: (time: number) => void
	handleUpdateClick: () => void
	error: string | null
	lobbySettings: LobbySettings
}

const LobbySettingsDisplay: React.FC<LobbySettingsDisplayProps> = ({
	role,
	isEditing,
	setIsEditing,
	maxPlayerCount,
	setMaxPlayerCount,
	promptInputTime,
	setPromptInputTime,
	drawingTime,
	setDrawingTime,
	handleUpdateClick,
	error,
	lobbySettings,
}) => {
	const renderLobbySettingsDefault = () => (
		<div className="flex flex-col items-centerborder-2 border-primary-light  rounded-x  p-6 border-2 dark:border-primary-dark rounded-x">
			<div className="flex justify-between w-full max-w-lg">
				<p className="text-xl font-semibold text-text-light dark:text-text-dark">
					Max Player Count:
				</p>
				<p className="text-text-light dark:text-text-dark">
					{lobbySettings.MaxPlayerCount}
				</p>
			</div>

			<div className="flex justify-between w-full max-w-lg">
				<p className="text-xl font-semibold text-text-light dark:text-text-dark">
					Prompt Input Time:
				</p>
				<p className="text-text-light dark:text-text-dark">
					{lobbySettings.PromtInputTime}
				</p>
			</div>

			<div className="flex justify-between w-full max-w-lg">
				<p className="text-xl font-semibold text-text-light dark:text-text-dark">
					Drawing Time:
				</p>
				<p className="text-text-light dark:text-text-dark">
					{lobbySettings.DrawingTime}
				</p>
			</div>
		</div>
	)

	const renderLobbySettingsEdit = () => (
		<div className="flex flex-col items-center p-6 border-2 border-primary-light dark:border-primary-dark rounded-x">
			<div className="flex justify-between w-full max-w-lg">
				<p className="text-xl font-semibold text-text-light dark:text-text-dark">
					Max Player Count:
				</p>
				<select
					value={maxPlayerCount}
					onChange={(e) => setMaxPlayerCount(Number(e.target.value))}
					className="p-2 border border-gray-300 rounded text-black text-lg"
				>
					{Array.from({ length: 10 }, (_, i) => (
						<option key={i + 1} value={i + 1}>
							{i + 1}
						</option>
					))}
				</select>
			</div>

			<div className="flex justify-between w-full max-w-lg">
				<p className="text-xl font-semibold text-text-light dark:text-text-dark">
					Prompt Input Time:
				</p>
				<select
					value={promptInputTime}
					onChange={(e) => setPromptInputTime(Number(e.target.value))}
					className="p-2 border border-gray-300 rounded text-black text-lg"
				>
					{Array.from({ length: 12 }, (_, i) => (
						<option key={(i + 1) * 10} value={(i + 1) * 10}>
							{(i + 1) * 10}
						</option>
					))}
				</select>
			</div>

			<div className="flex justify-between w-full max-w-lg">
				<p className="text-xl font-semibold text-text-light dark:text-text-dark">
					Drawing Time:
				</p>
				<select
					value={drawingTime}
					onChange={(e) => setDrawingTime(Number(e.target.value))}
					className="p-2 border border-gray-300 rounded text-black text-lg"
				>
					{Array.from({ length: 12 }, (_, i) => (
						<option key={(i + 1) * 10} value={(i + 1) * 10}>
							{(i + 1) * 10}
						</option>
					))}
				</select>
			</div>

			{error && <p className="text-red-500 mb-4 text-lg">{error}</p>}

			<div className="flex gap-4">
				<button
					onClick={handleUpdateClick}
					className="mt-4 bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-full transition duration-200 hover:bg-primary-dark dark:hover:bg-primary-light text-lg"
				>
					Save Changes
				</button>
				<button
					onClick={() => setIsEditing(false)}
					className="mt-4 bg-secondary-light dark:bg-secondary-dark text-black px-4 py-2 rounded-full transition duration-200 hover:bg-secondary-dark dark:hover:bg-secondary-light text-lg"
				>
					Cancel
				</button>
			</div>
		</div>
	)

	return (
		<div className="flex flex-col items-center bg-background-light dark:bg-background-dark l">
			<h3 className="text-primary-light dark:text-primary-dark text-4xl font-bold mb-4">
				Lobby Settings
			</h3>
			{isEditing
				? renderLobbySettingsEdit()
				: renderLobbySettingsDefault()}
			{role === "leader" && !isEditing && (
				<button
					onClick={() => setIsEditing(true)}
					className="mt-4 bg-primary-light dark:bg-primary-dark text-white px-4 py-2 rounded-full font-bold transition-colors duration-300 hover:bg-primary-dark dark:hover:bg-primary-light"
				>
					Edit Lobby Settings
				</button>
			)}
		</div>
	)
}

export default LobbySettingsDisplay
