import React, { useRef, useState, useEffect } from "react"
import CanvasColorPicker from "./CanvasColorPicker"
import ClearCanvas from "./ClearCanvas"
import CanvasLineWidthAdjuster from "./CanvasLineWidthAdjuster"

const Canvas: React.FC = () => {
	const [lineColor, setLineColor] = useState<string>("black")
	const [lineWidth, setLineWidth] = useState<number>(2)
	const [clearCanvas, setClearCanvas] = useState<boolean>(false)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const [isDrawing, setIsDrawing] = useState(false)

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas?.getContext("2d")

		if (canvas && context) {
			canvas.width = 800
			canvas.height = 800
			context.fillStyle = "white"
			context.fillRect(0, 0, canvas.width, canvas.height)
		}
	}, [clearCanvas])

	useEffect(() => {
		if (clearCanvas) {
			const canvas = canvasRef.current
			const context = canvas?.getContext("2d")
			if (context && canvas) {
				context.clearRect(0, 0, canvas.width, canvas.height)
				context.fillStyle = "white"
				context.fillRect(0, 0, canvas.width, canvas.height)
			}
			setClearCanvas(false)
		}
	}, [clearCanvas])

	const startDrawing = (e: React.MouseEvent) => {
		const canvas = canvasRef.current
		const context = canvas?.getContext("2d")

		if (context) {
			context.beginPath()
			context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
			setIsDrawing(true)
		}
	}

	const draw = (e: React.MouseEvent) => {
		const context = canvasRef.current?.getContext("2d")

		if (isDrawing && context) {
			context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
			context.strokeStyle = lineColor
			context.lineWidth = lineWidth
			context.stroke()
		}
	}

	const stopDrawing = () => {
		const context = canvasRef.current?.getContext("2d")

		if (context && isDrawing) {
			context.closePath()
			setIsDrawing(false)
		}
	}

	return (
		<div>
			<CanvasColorPicker
				lineColor={lineColor}
				setLineColor={setLineColor}
			/>
			<CanvasLineWidthAdjuster
				lineWidth={lineWidth}
				setLineWidth={setLineWidth}
			/>
			<ClearCanvas
				clearCanvas={clearCanvas}
				setClearCanvas={setClearCanvas}
			/>
			<canvas
				ref={canvasRef}
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={stopDrawing}
				onMouseLeave={stopDrawing}
				style={{ border: "1px solid black" }}
			/>
		</div>
	)
}

export default Canvas
