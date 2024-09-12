import React from "react"

type ClearCanvasProps = {
	clearCanvas: boolean
	setClearCanvas: (clearCanvas: boolean) => void
}

const ClearCanvas: React.FC<ClearCanvasProps> = ({ setClearCanvas }) => {
	return (
		<div>
			<button onClick={() => setClearCanvas(true)}>Clear Canvas</button>
		</div>
	)
}

export default ClearCanvas
