import React from "react"

type CanvasLineWidthAdjusterProps = {
	lineWidth: number
	setLineWidth: (lineWidth: number) => void
}

const CanvasLineWidthAdjuster: React.FC<CanvasLineWidthAdjusterProps> = ({
	lineWidth,
	setLineWidth,
}) => {
	return (
		<div>
			<label>Line Width: {lineWidth}</label>
			<input
				type="range"
				min="1"
				max="10"
				value={lineWidth}
				onChange={(e) => setLineWidth(Number(e.target.value))}
			/>
		</div>
	)
}

export default CanvasLineWidthAdjuster
