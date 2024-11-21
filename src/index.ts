import { config } from "./config/config"
import { GameState } from "./core/GameState"
import { Game } from "./core/Tetris"
import { Renderer } from "./render/Renderer"
import { Controls } from "./core/Controls"

// Select the main game canvas and setup context
const gameCanvas = document.getElementById("gamearena") as HTMLCanvasElement
const gameCtx = gameCanvas.getContext("2d")
if (!gameCtx) throw new Error("Failed to get the game canvas context")

// Select the bullpen canvas and setup context
const bullpenCanvas = document.getElementById("bullpen") as HTMLCanvasElement
const bullpenCtx = bullpenCanvas.getContext("2d")
if (!bullpenCtx) throw new Error("Failed to get the bullpen canvas context")

// Scale the canvases based on configuration
gameCtx.scale(config.canvasScale, config.canvasScale)
bullpenCtx.scale(config.bullpenScale, config.bullpenScale)

// Initialize the game state
const gameState = new GameState(config.arenaHeight, config.arenaWidth)

// Initialize the renderer
const renderer = new Renderer(gameCtx, config.canvasScale)

// Initialize the Tetris game logic
const game = new Game(gameState, renderer)

// Initialize controls and bind them to the game
const controls = new Controls(game)
controls.bind()

// Render the initial state of the bullpen
if (gameState.nextPiece) {
  renderer.renderBullpen(bullpenCtx, gameState.nextPiece)
}

// Start the game loop
game.start()

