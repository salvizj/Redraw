import React, { useRef, useState, useEffect } from 'react';

const DrawingCanvas: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [drawing, setDrawing] = useState(false);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return; // Add null check

		const ctx = canvas.getContext('2d');
		if (!ctx) return; // Add null check for context

		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'black';

		const startDrawing = (event: MouseEvent) => {
			setDrawing(true);
			draw(event); // Draw a dot where the user starts
		};

		const stopDrawing = () => {
			setDrawing(false);
			ctx.beginPath(); // Start a new path so the next stroke doesn't connect
		};

		const draw = (event: MouseEvent) => {
			if (!drawing) return;

			ctx.lineTo(
				event.clientX - canvas.offsetLeft,
				event.clientY - canvas.offsetTop
			);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(
				event.clientX - canvas.offsetLeft,
				event.clientY - canvas.offsetTop
			);
		};

		const handleMouseDown = startDrawing;
		const handleMouseUp = stopDrawing;
		const handleMouseMove = draw;

		canvas.addEventListener('mousedown', handleMouseDown);
		canvas.addEventListener('mouseup', handleMouseUp);
		canvas.addEventListener('mousemove', handleMouseMove);

		return () => {
			canvas.removeEventListener('mousedown', handleMouseDown);
			canvas.removeEventListener('mouseup', handleMouseUp);
			canvas.removeEventListener('mousemove', handleMouseMove);
		};
	}, [drawing]);

	return (
		<canvas
			ref={canvasRef}
			width={500}
			height={500}
			style={{ border: '1px solid black', cursor: 'crosshair' }}
		/>
	);
};

export default DrawingCanvas;
