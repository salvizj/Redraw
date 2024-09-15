import React from "react"

type CanvasEraserProps = {
	canvasBgColor: string
	setLineColor: (lineColor: string) => void
}

const CanvasEraser: React.FC<CanvasEraserProps> = ({
	canvasBgColor,
	setLineColor,
}) => {
	return (
		<div>
			<button
				onClick={() => setLineColor(canvasBgColor)}
				title="Use Eraser"
				className="btn btn-primary"
			>
				🧽
			</button>
		</div>
	)
}

export default CanvasEraser
