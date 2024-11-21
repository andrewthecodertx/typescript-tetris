import { Game } from "./Tetris"
import { config } from "../config/config"

export class Controls {
  private keyMap: Record<string, () => void>

  /**
   * Initializes the controls with the given game instance
   * @param game - The instance of the Tetris game to control
   */
  constructor(private game: Game) {
    this.keyMap = {
      ...this.createKeyBindings(),
    }
  }

  /**
   * Binds event listeners for keydown events
   */
  bind(): void {
    document.addEventListener("keydown", this.handleKey.bind(this))
  }

  /**
   * Unbinds event listeners for keydown events
   */
  unbind(): void {
    document.removeEventListener("keydown", this.handleKey.bind(this))
  }

  /**
   * Handles keydown events and executes the mapped action
   * @param event - The KeyboardEvent triggered by keypress
   */
  private handleKey(event: KeyboardEvent): void {
    const action = this.keyMap[event.code]
    if (action) {
      action()
      event.preventDefault()
    }
  }

  /**
   * Maps configured key bindings to corresponding game actions
   * @returns A mapping of key codes to game actions
   */
  private createKeyBindings(): Record<string, () => void> {
    return {
      // Movement
      ...config.keyBindings.moveLeft.reduce((map, key) => {
        map[key] = () => this.game.movePiece(-1)
        return map
      }, {} as Record<string, () => void>),

      ...config.keyBindings.moveRight.reduce((map, key) => {
        map[key] = () => this.game.movePiece(1)
        return map
      }, {} as Record<string, () => void>),

      ...config.keyBindings.moveDown.reduce((map, key) => {
        map[key] = () => this.game.dropPiece()
        return map
      }, {} as Record<string, () => void>),

      // Rotation
      ...config.keyBindings.rotateLeft.reduce((map, key) => {
        map[key] = () => this.game.rotatePiece(-1)
        return map
      }, {} as Record<string, () => void>),

      ...config.keyBindings.rotateRight.reduce((map, key) => {
        map[key] = () => this.game.rotatePiece(1)
        return map
      }, {} as Record<string, () => void>),

      // Hard drop
      ...config.keyBindings.hardDrop.reduce((map, key) => {
        map[key] = () => {
          while (!this.game.state.isGameOver()) {
            this.game.dropPiece()
          }
        }
        return map
      }, {} as Record<string, () => void>)
    }
  }
}
