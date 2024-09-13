import React from "react"

type CanvasColorPickerProps = {
	lineColor: string
	setLineColor: (color: string) => void
}

const CanvasColorPicker: React.FC<CanvasColorPickerProps> = ({
	lineColor,
	setLineColor,
}) => {
	const colors = ["green", "red", "blue", "yellow", "purple", "black"]

	return (
		<div className="color-picker">
			<p className="color-display">
				Selected Color: <span className="capitalize">{lineColor}</span>
			</p>
			<div className="color-options">
				{colors.map((clr) => (
					<button
						key={clr}
						className="color-button"
						style={{ backgroundColor: clr }}
						onClick={() => setLineColor(clr)}
					/>
				))}
			</div>
		</div>
	)
}

export default CanvasColorPicker
