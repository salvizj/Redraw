import React from "react"
import { useTheme } from "../../context/themeContext"
import ThemeDropdown from "./ThemeDropdown"
import LanguageDropdown from "./LanguageDropdown"
import { Outlet } from "react-router-dom"

const Layout: React.FC = () => {
	const { theme } = useTheme()

	return (
		<div className={`layout ${theme === "dark" ? "dark" : ""}`}>
			<header className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans absolute right-0 flex items-center">
				<ThemeDropdown />
				<LanguageDropdown />
			</header>
			<main className="min-h-fit w-full bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
				<Outlet />
			</main>
		</div>
	)
}

export default Layout
