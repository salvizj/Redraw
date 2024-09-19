import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from "react"

type Language = "en" | "lv"

type LanguageContextType = {
	language: Language
	setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
)

export const useLanguage = () => {
	const context = useContext(LanguageContext)
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider")
	}
	return context
}

const LOCAL_STORAGE_KEY = "app-language"

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState<Language>(() => {
		const savedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY)
		return (savedLanguage as Language) || "en"
	})

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, language)
		document.documentElement.setAttribute("lang", language)
		document.documentElement.className =
			language === "en" ? "lang-en" : "lang-lv"
	}, [language])

	return (
		<LanguageContext.Provider value={{ language, setLanguage }}>
			{children}
		</LanguageContext.Provider>
	)
}
