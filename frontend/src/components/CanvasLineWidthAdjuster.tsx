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
		<div className="line-width-control">
			<label className="line-width-label">
				Line Width: <span>{lineWidth}</span>
			</label>
			<input
				type="range"
				min="1"
				max="50"
				value={lineWidth}
				onChange={(e) => setLineWidth(Number(e.target.value))}
				className="line-width-input"
			/>
		</div>
	)
}

export default CanvasLineWidthAdjuster
