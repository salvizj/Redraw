import React from "react"

type ClearCanvasProps = {
	clearCanvas: boolean
	setClearCanvas: (clearCanvas: boolean) => void
}

const ClearCanvas: React.FC<ClearCanvasProps> = ({ setClearCanvas }) => {
	return (
		<div>
			<button
				className="btn btn-primary"
				onClick={() => setClearCanvas(true)}
			>
				Clear Canvas
			</button>
		</div>
	)
}

export default ClearCanvas
