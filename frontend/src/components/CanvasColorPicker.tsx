import React from "react"

type CanvasColorPickerProps = {
	lineColor: string
	setLineColor: (color: string) => void
}

const CanvasColorPicker: React.FC<CanvasColorPickerProps> = ({
	lineColor,
	setLineColor,
}) => {
	const colors = ["Green", "Red", "Blue", "Yellow", "Purple", "Black"]

	return (
		<div>
			<p>Selected Color: {lineColor}</p>
			{colors.map((clr) => (
				<button key={clr} onClick={() => setLineColor(clr)}>
					{clr}
				</button>
			))}
		</div>
	)
}

export default CanvasColorPicker
