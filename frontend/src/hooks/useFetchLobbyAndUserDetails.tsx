import { useState, useCallback, useEffect } from "react"
import { useFetchLobbyDetails } from "../hooks/useFetchLobbyDetails"
import { useFetchUserDetails } from "../hooks/useFetchUserDetails"
import { useLanguage } from "../context/languageContext"

const useFetchLobbyAndUserDetails = () => {
	const { fetchDetails: fetchLobbyDetails, error: errorLobbyDetails } =
		useFetchLobbyDetails()
	const { fetchDetails: fetchUserDetails, error: errorUserDetails } =
		useFetchUserDetails()
	const { language } = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const fetchData = useCallback(async () => {
		try {
			await Promise.all([fetchUserDetails(), fetchLobbyDetails()])
		} catch {
			setError(
				language === "en"
					? "Failed to fetch lobby or user details."
					: "Neizdevās iegūt istabas vai lietotāja informāciju."
			)
		} finally {
			setIsLoading(false)
		}
	}, [fetchUserDetails, fetchLobbyDetails, language])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return {
		isLoading,
		error: error || errorLobbyDetails || errorUserDetails,
	}
}

export default useFetchLobbyAndUserDetails
