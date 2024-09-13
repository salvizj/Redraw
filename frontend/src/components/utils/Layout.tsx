import React from "react"
import { useTheme } from "../../context/themeContext"
import ThemeDropdown from "./ThemeDropdown"
import { Outlet } from "react-router-dom"

const Layout: React.FC = () => {
	const { theme } = useTheme()
	return (
		<div className={`layout ${theme === "dark" ? "dark" : ""}`}>
			<header className="layout-header">
				<ThemeDropdown />
			</header>
			<main className="layout-main">
				<Outlet />
			</main>
		</div>
	)
}

export default Layout
