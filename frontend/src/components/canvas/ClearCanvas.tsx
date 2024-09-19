import React from "react"
import { useLanguage } from "../../context/languageContext"
type ClearCanvasProps = {
	clearCanvas: boolean
	setClearCanvas: (clearCanvas: boolean) => void
}

const ClearCanvas: React.FC<ClearCanvasProps> = ({ setClearCanvas }) => {
	const { language } = useLanguage()
	return (
		<div>
			<button
				className="btn btn-primary"
				onClick={() => setClearCanvas(true)}
			>
				{language === "en" ? "Clear Canvas" : "Notīrīt Audeklu"}{" "}
			</button>
		</div>
	)
}

export default ClearCanvas
