import { useState, useCallback } from "react"
import { fetchUserDetails } from "../api/user/getUserDetailsApi"
import { useUserContext } from "../context/userContext"
import { UserDetails } from "../types"

export const useFetchUserDetails = () => {
	const { setUsername, setRole, setSessionId } = useUserContext()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchDetails = useCallback(async () => {
		setLoading(true)
		try {
			const userdata: UserDetails = await fetchUserDetails()
			setUsername(userdata.username)
			setRole(userdata.role)
			setSessionId(userdata.sessionId)
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}, [setUsername, setRole, setSessionId])

	return { loading, error, fetchDetails }
}
