import React from "react"
import { useLanguage } from "../../context/languageContext"

const LanguageDropdown: React.FC = () => {
	const { language, setLanguage } = useLanguage()

	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setLanguage(event.target.value as "en" | "lv")
	}

	return (
		<div className="flex justify-end bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-4 rounded">
			<select
				value={language}
				onChange={handleChange}
				className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark border border-primary-light dark:border-primary-dark rounded p-2 font-sans"
			>
				<option value="en">English</option>
				<option value="lv">Latvian</option>
			</select>
		</div>
	)
}

export default LanguageDropdown
