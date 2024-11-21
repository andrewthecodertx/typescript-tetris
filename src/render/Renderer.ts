import { config } from "../config/config"
import { GameState } from "../core/GameState"
import { Piece } from "../core/Piece"
import cube from "../assets/cube.png"

export class Renderer {
  private cubeImage: HTMLImageElement

  /**
   * Initializes the renderer with the given canvas context and scale
   * @param ctx - The rendering context for the main game canvas
   * @param scale - Scale factor for rendering
   */
  constructor(private ctx: CanvasRenderingContext2D, private scale: number) {
    this.cubeImage = new Image()
    this.cubeImage.src = cube
  }

  /**
   * Clears the canvas and renders the game state
   * @param state - The current game state
   */
  render(state: GameState): void {
    this.clearCanvas(config.arenaWidth, config.arenaHeight)
    this.renderMatrix(state.arena, { x: 0, y: 0 })

    if (state.activePiece) {
      this.renderMatrix(state.activePiece.matrix, state.activePiece.position)
    }
  }

  /**
   * Renders the bullpen to the secondary canvas context
   * @param bullpenCtx - The rendering context for the bullpen canvas
   * @param nextPiece - The next piece to render
   */
  renderBullpen(bullpenCtx: CanvasRenderingContext2D, nextPiece: Piece): void {
    const { bullpenWidth, bullpenHeight } = config

    bullpenCtx.clearRect(0, 0, bullpenWidth * this.scale, bullpenHeight * this.scale)
    bullpenCtx.fillStyle = "rgba(255, 255, 255, 0.5)"
    bullpenCtx.fillRect(0, 0, bullpenWidth * this.scale, bullpenHeight * this.scale)

    if (nextPiece) {
      this.renderMatrix(nextPiece.matrix, { x: 0, y: 0 }, bullpenCtx)
    }
  }

  /**
   * Clears the canvas
   * @param width - Width of the canvas in blocks
   * @param height - Height of the canvas in blocks
   */
  private clearCanvas(width: number, height: number): void {
    this.ctx.fillStyle = "rgba(0, 0, 0, 1)"
    this.ctx.fillRect(0, 0, width * this.scale, height * this.scale)
  }

  /**
   * Renders a matrix to the canvas
   * @param matrix - The 2D array to render
   * @param offset - The offset to apply to the rendering position
   * @param context - The rendering context (defaults to the main canvas context)
   */
  private renderMatrix(
    matrix: number[][],
    offset: { x: number; y: number },
    context: CanvasRenderingContext2D = this.ctx
  ): void {
    matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.drawImage(
            this.cubeImage,
            (x + offset.x) * this.scale,
            (y + offset.y) * this.scale,
            this.scale,
            this.scale
          )
          context.fillStyle = `rgba(${config.colors[value]}, 0.4)`
          context.fillRect(
            (x + offset.x) * this.scale,
            (y + offset.y) * this.scale,
            this.scale,
            this.scale
          )
        }
      })
    })
  }
}
