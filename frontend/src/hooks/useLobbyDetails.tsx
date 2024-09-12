import { useCallback, useState } from "react"
import { fetchLobbyDetails } from "../api/getLobbyDetailsApi"
import { useLobbyContext } from "../context/lobbyContext"
import { LobbyDetails } from "../types"

export const useLobbyDetails = () => {
	const { setLobbyId, setPlayers, setLobbySettings } = useLobbyContext()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchDetails = useCallback(async () => {
		setLoading(true)
		try {
			const lobbydetails: LobbyDetails = await fetchLobbyDetails()
			setLobbyId(lobbydetails.lobbyId)
			setPlayers(lobbydetails.players)
			setLobbySettings(lobbydetails.lobbySettings)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [setLobbyId, setPlayers, setLobbySettings])

	return { loading, error, fetchDetails }
}
