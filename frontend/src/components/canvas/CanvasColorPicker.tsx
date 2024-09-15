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
		<div>
			<p>
				Selected Color: <span>{lineColor}</span>
			</p>
			<div>
				{colors.map((clr) => (
					<button
						key={clr}
						style={{ backgroundColor: clr }}
						onClick={() => setLineColor(clr)}
					/>
				))}
			</div>
		</div>
	)
}

export default CanvasColorPicker
