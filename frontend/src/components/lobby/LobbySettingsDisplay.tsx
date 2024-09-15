import React from "react"
import { LobbySettings as LobbySettingsType } from "../../types"

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
	lobbySettings: LobbySettingsType
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
		<>
			<p className="mb-2 text-xl font-semibold text-text-light dark:text-text-dark">
				Max Player Count:
			</p>
			<p className="text-text-light dark:text-text-dark mb-4">
				{lobbySettings.MaxPlayerCount}
			</p>

			<p className="mb-2 text-xl font-semibold text-text-light dark:text-text-dark">
				Prompt Input Time:
			</p>
			<p className="text-text-light dark:text-text-dark mb-4">
				{lobbySettings.PromtInputTime}
			</p>

			<p className="mb-2 text-xl font-semibold text-text-light dark:text-text-dark">
				Drawing Time:
			</p>
			<p className="text-text-light dark:text-text-dark mb-4">
				{lobbySettings.DrawingTime}
			</p>
		</>
	)

	const renderLobbySettingsEdit = () => (
		<>
			<p className="mb-2 text-xl font-semibold text-text-light dark:text-text-dark">
				Max Player Count:
			</p>
			<select
				value={maxPlayerCount}
				onChange={(e) => setMaxPlayerCount(Number(e.target.value))}
				className="ml-2 p-2 border border-gray-300 rounded text-black text-lg mb-4"
			>
				{Array.from({ length: 10 }, (_, i) => (
					<option key={i + 1} value={i + 1}>
						{i + 1}
					</option>
				))}
			</select>

			<p className="mb-2 text-xl font-semibold text-text-light dark:text-text-dark">
				Prompt Input Time:
			</p>
			<select
				value={promptInputTime}
				onChange={(e) => setPromptInputTime(Number(e.target.value))}
				className="ml-2 p-2 border border-gray-300 rounded text-black text-lg mb-4"
			>
				{Array.from({ length: 12 }, (_, i) => (
					<option key={(i + 1) * 10} value={(i + 1) * 10}>
						{(i + 1) * 10}
					</option>
				))}
			</select>

			<p className="mb-2 text-xl font-semibold text-text-light dark:text-text-dark">
				Drawing Time:
			</p>
			<select
				value={drawingTime}
				onChange={(e) => setDrawingTime(Number(e.target.value))}
				className="ml-2 p-2 border border-gray-300 rounded text-black text-lg mb-4"
			>
				{Array.from({ length: 12 }, (_, i) => (
					<option key={(i + 1) * 10} value={(i + 1) * 10}>
						{(i + 1) * 10}
					</option>
				))}
			</select>

			{error && <p className="text-red-500 mb-4 text-lg">{error}</p>}

			<button
				onClick={handleUpdateClick}
				className="mt-4 bg-primary-light dark:bg-primary-dark text-white p-2 rounded-full transition duration-200 hover:bg-primary-dark dark:hover:bg-primary-light text-lg"
			>
				Save Changes
			</button>
			<button
				onClick={() => setIsEditing(false)}
				className="mt-4 ml-4 bg-secondary-light dark:bg-secondary-dark text-black p-2 rounded-full transition duration-200 hover:bg-secondary-dark dark:hover:bg-secondary-light text-lg"
			>
				Cancel
			</button>
		</>
	)

	return (
		<div>
			{role === "leader" && !isEditing && (
				<button
					onClick={() => setIsEditing(true)}
					className="bg-primary-light dark:bg-primary-dark text-white p-2 rounded-full transition duration-200 hover:bg-primary-dark dark:hover:bg-primary-light text-lg"
				>
					Edit Lobby Settings
				</button>
			)}
			{isEditing
				? renderLobbySettingsEdit()
				: renderLobbySettingsDefault()}
		</div>
	)
}

export default LobbySettingsDisplay
