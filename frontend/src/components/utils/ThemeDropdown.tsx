import React from "react"
import { useTheme } from "../../context/themeContext"

const ThemeDropdown: React.FC = () => {
	const { theme, setTheme } = useTheme()
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setTheme(event.target.value as "light" | "dark")
	}
	return (
		<div className="theme-dropdown">
			<select
				value={theme}
				onChange={handleChange}
				className="theme-select"
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	)
}

export default ThemeDropdown
