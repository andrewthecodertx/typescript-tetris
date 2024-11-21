/**
 * Clears the given canvas context.
 * @param ctx - The canvas rendering context
 * @param width - The width of the canvas in blocks
 * @param height - The height of the canvas in blocks
 * @param scale - The scale factor for rendering
 */
export function clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, scale: number): void {
  ctx.fillStyle = "rgba(0, 0, 0, 1)"
  ctx.fillRect(0, 0, width * scale, height * scale)
}

/**
 * Draws a grid on the canvas for debugging purposes.
 * @param ctx - The canvas rendering context
 * @param width - The width of the grid in blocks
 * @param height - The height of the grid in blocks
 * @param scale - The scale factor for rendering
 */
export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, scale: number): void {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"

  for (let x = 0; x < width; x++) {
    ctx.beginPath()
    ctx.moveTo(x * scale, 0)
    ctx.lineTo(x * scale, height * scale)
    ctx.stroke()
  }

  for (let y = 0; y < height; y++) {
    ctx.beginPath()
    ctx.moveTo(0, y * scale)
    ctx.lineTo(width * scale, y * scale)
    ctx.stroke()
  }
}
