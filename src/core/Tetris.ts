import { config } from "../config/config"
import { GameState } from "./GameState"
import { Renderer } from "../render/Renderer"
import { Piece } from "./Piece"
import { detectCollision } from "../utils/collision"
import { rotateMatrix } from "../utils/matrix"

type PieceType = "I" | "O" | "T" | "J" | "L" | "S" | "Z"

export class Game {
  private dropCounter: number = 0
  private lastTime: number = 0
  private dropSpeed: number = config.initialDropSpeed
  private standbyPiece: PieceType = this.randomPiece()
  private cancelId: number = 0

  constructor(
    private state: GameState,
    private renderer: Renderer
  ) { }

  /**
   * Starts the game loop.
   */
  start(): void {
    this.spawnPiece()
    this.update()
  }

  /**
   * Handles the main game update loop.
   * @param time - Current timestamp
   */
  private update(time: number = 0): void {
    const delta = time - this.lastTime

    this.dropCounter += delta

    if (this.dropCounter > this.dropSpeed) {
      this.dropPiece()
    }

    this.lastTime = time
    this.renderer.render(this.state)
    this.cancelId = requestAnimationFrame((t) => this.update(t))
  }

  /**
   * Spawns a new piece into the game arena.
   */
  private spawnPiece(): void {
    const shapeMatrix = config.pieces[this.standbyPiece]
    const newPiece = new Piece(
      { x: Math.floor((config.arenaWidth - shapeMatrix[0].length) / 2), y: 0 },
      shapeMatrix
    )

    // Check for game over
    if (this.state.arena.some(row => row.some(cell => cell !== 0)) &&
      detectCollision(this.state.arena, newPiece)) {
      console.log("game over triggered by spawnPiece function")
      this.gameOver()

      return
    }

    this.state.activePiece = newPiece

    // Prepare the next piece
    this.standbyPiece = this.randomPiece()
    this.state.nextPiece = new Piece({ x: 0, y: 0 }, config.pieces[this.standbyPiece])
  }

  /**
   * Randomly selects the next piece.
   */
  private randomPiece(): PieceType {
    const pieces: PieceType[] = ["T", "J", "L", "O", "I", "S", "Z"]
    return pieces[Math.floor(Math.random() * pieces.length)]
  }

  /**
   * Drops the active piece by one row.
   */
  dropPiece(): void {
    if (!this.state.activePiece) return

    this.state.activePiece.position.y++
    if (detectCollision(this.state.arena, this.state.activePiece)) {
      this.state.activePiece.position.y--
      this.mergePiece()
      this.clearRows()
      this.spawnPiece()
    }
    this.dropCounter = 0
  }

  /**
   * Moves the active piece horizontally.
   * @param offset - Number of columns to move (positive for right, negative for left)
   */
  movePiece(offset: number): void {
    if (!this.state.activePiece) return

    this.state.activePiece.position.x += offset
    if (detectCollision(this.state.arena, this.state.activePiece)) {
      this.state.activePiece.position.x -= offset
    }
  }

  /**
   * Rotates the active piece.
   * @param direction - Rotation direction (1 for clockwise, -1 for counterclockwise)
   */
  rotatePiece(direction: number): void {
    if (!this.state.activePiece) return

    const originalMatrix = this.state.activePiece.matrix
    this.state.activePiece.matrix = rotateMatrix(originalMatrix, direction)

    let offset = 1
    while (detectCollision(this.state.arena, this.state.activePiece)) {
      this.state.activePiece.position.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (Math.abs(offset) > originalMatrix[0].length) {
        this.state.activePiece.matrix = originalMatrix // Revert rotation if no valid position
        return
      }
    }
  }

  /**
   * Clears completed rows and updates the score.
   */
  private clearRows(): void {
    let rowsCleared = 0

    for (let y = this.state.arena.length - 1; y >= 0; y--) {
      if (this.state.arena[y].every((value) => value !== 0)) {
        this.state.arena.splice(y, 1)
        this.state.arena.unshift(Array(config.arenaWidth).fill(0))
        rowsCleared++
        y++ // Check the same row again after shifting
      }
    }

    if (rowsCleared > 0) {
      this.state.score += rowsCleared * config.rowsClearedScore
      this.state.lines += rowsCleared

      if (this.state.score >= config.levelScoreThreshold * this.state.level) {
        this.state.level++
        this.dropSpeed = Math.max(config.minDropSpeed, this.dropSpeed - 200)
      }
    }
  }

  /**
   * Merges the active piece into the arena.
   */
  private mergePiece(): void {
    this.state.activePiece?.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.state.arena[y + this.state.activePiece!.position.y][x + this.state.activePiece!.position.x] = value
        }
      })
    })
  }

  /**
   * Ends the game.
   */
  private gameOver(): void {
    cancelAnimationFrame(this.cancelId)
    console.log("Game Over")
    // Additional game over logic here (e.g., display game over screen, reset state, etc.)
  }
}
