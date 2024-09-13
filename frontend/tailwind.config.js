/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				"primary": {
					DEFAULT: "#3b82f6", // blue-500
					hover: "#2563eb", // blue-600
					disabled: "#93c5fd", // blue-300
					dark: "#1d4ed8", // blue-700
				},
				"background": {
					light: "#ffffff",
					dark: "#1f2937", // gray-800
				},
				"text": {
					light: "#1f2937", // gray-800
					dark: "#f3f4f6", // gray-100
				},
				"label": {
					light: "#4b5563", // gray-600
					dark: "#d1d5db", // gray-300
				},
				"error": "#ef4444", // red-500
				"light-border": "#e5e7eb", // gray-200
				"card-bg": {
					light: "#f3f4f6", // gray-100
					dark: "#374151", // gray-700
				},
				"canvas-border": "#000000",
				"form-focus": "#3b82f6",
			},
		},
	},
	plugins: [],
}
