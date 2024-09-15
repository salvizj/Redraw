import React from "react"
import { useTheme } from "../../context/themeContext"

const ThemeDropdown: React.FC = () => {
	const { theme, setTheme } = useTheme()

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setTheme(event.target.value as "light" | "dark")
	}

	return (
		<div className="flex justify-end bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-4 rounded">
			<select
				value={theme}
				onChange={handleChange}
				className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-primary-light dark:border-primary-dark rounded p-2 font-sans"
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
		</div>
	)
}

export default ThemeDropdown
