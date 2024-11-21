import { config } from "../config/config"
import { Piece } from "./Piece"

export class GameState {
  arena: number[][]          // Main game arena grid
  activePiece: Piece | null  // The piece currently being controlled by the player
  nextPiece: Piece | null    // The next piece waiting in the bullpen
  score: number              // Player's current score
  level: number              // Current game level
  lines: number              // Total lines cleared

  /**
   * Initializes the game state with default values.
   * @param height - Number of rows in the arena
   * @param width - Number of columns in the arena
   */
  constructor(height: number = config.arenaHeight, width: number = config.arenaWidth) {
    this.arena = this.createArena(height, width)
    this.activePiece = null
    this.nextPiece = null
    this.score = 0
    this.level = 1
    this.lines = 0
  }

  /**
   * Creates an empty game arena grid.
   * @param height - Number of rows in the arena
   * @param width - Number of columns in the arena
   * @returns A 2D array filled with zeros
   */
  private createArena(height: number, width: number): number[][] {
    return Array.from({ length: height }, () => Array(width).fill(0))
  }

  /**
   * Resets the game state to start a new game.
   */
  reset(): void {
    this.arena = this.createArena(config.arenaHeight, config.arenaWidth)
    this.activePiece = null
    this.nextPiece = null
    this.score = 0
    this.level = 1
    this.lines = 0
  }

  /**
   * Updates the score when rows are cleared.
   * @param rowsCleared - The number of rows cleared
   */
  updateScore(rowsCleared: number): void {
    const points = rowsCleared * config.rowsClearedScore
    this.score += points
    this.lines += rowsCleared

    if (this.score >= this.level * config.levelScoreThreshold) {
      this.level++
    }
  }

  /**
   * Adds the active piece to the arena grid.
   * This is called when a piece "locks" in place.
   */
  mergeActivePiece(): void {
    if (!this.activePiece) return

    this.activePiece.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.arena[y + this.activePiece!.position.y][x + this.activePiece!.position.x] = value
        }
      })
    })
  }

  /**
   * Checks if the game state indicates a game over.
   * @returns `true` if the game is over, otherwise `false`
   */
  isGameOver(): boolean {
    if (!this.activePiece) return false

    return this.activePiece.matrix.some((row, y) =>
      row.some((value, x) =>
        value !== 0 &&
        this.arena[y + this.activePiece!.position.y]?.[x + this.activePiece!.position.x] !== 0
      )
    )
  }
}
