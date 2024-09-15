/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				primary: {
					light: "#4f8d8c",
					dark: "#2d6a4f",
				},
				secondary: {
					light: "#d4eddd",
					dark: "#7a9a5b",
				},
				third: {
					light: "#a9c9a3",
					dark: "#5a7a4d",
				},
				background: {
					light: "#f9f9f9",
					dark: "#2d2d2d",
				},
				text: {
					light: "#333333",
					dark: "#f9f9f9",
				},
			},
			fontFamily: {
				sans: ["'Comic Sans MS'", "sans-serif"],
				serif: ["Georgia", "serif"],
				mono: ["Menlo", "monospace"],
			},
		},
	},
	plugins: [],
}
