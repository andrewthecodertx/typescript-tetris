type PieceType = "I" | "J" | "L" | "O" | "S" | "T" | "Z"
type PieceMatrix = number[][]

export const config = {
  // Canvas settings
  canvasScale: 30,        // Scale factor for the main game canvas
  bullpenScale: 20,       // Scale factor for the bullpen canvas

  // Game settings
  initialDropSpeed: 1000, // Initial drop speed in milliseconds
  minDropSpeed: 200,      // Minimum drop speed in milliseconds
  levelScoreThreshold: 50, // Points required to advance a level
  rowsClearedScore: 10,   // Score awarded per row cleared

  // Game arena dimensions
  arenaHeight: 20,        // Number of rows in the main game arena
  arenaWidth: 10,         // Number of columns in the main game arena

  // Bullpen dimensions
  bullpenHeight: 4,       // Number of rows in the bullpen
  bullpenWidth: 2,        // Number of columns in the bullpen

  // Colors for each type of Tetris piece
  colors: [
    null,                 // No color for empty cells
    "0, 255, 255",        // I piece (cyan)
    "0, 0, 255",          // J piece (blue)
    "255, 165, 0",        // L piece (orange)
    "255, 255, 0",        // O piece (yellow)
    "0, 128, 0",          // S piece (green)
    "128, 0, 128",        // T piece (purple)
    "255, 0, 0",          // Z piece (red)
  ],

  // Piece definitions: matrices for each Tetris piece
  pieces: {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: [
      [2, 0, 0],
      [2, 2, 2],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 3],
      [3, 3, 3],
      [0, 0, 0],
    ],
    O: [
      [4, 4],
      [4, 4],
    ],
    S: [
      [0, 5, 5],
      [5, 5, 0],
      [0, 0, 0],
    ],
    T: [
      [0, 6, 0],
      [6, 6, 6],
      [0, 0, 0],
    ],
    Z: [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ],
  } as Record<PieceType, PieceMatrix>,

  // Keybindings
  keyBindings: {
    moveLeft: ["ArrowLeft", "KeyH"],  // Move left
    moveRight: ["ArrowRight", "KeyL"], // Move right
    moveDown: ["ArrowDown", "KeyJ"],   // Soft drop
    rotateLeft: ["KeyA"],             // Rotate counterclockwise
    rotateRight: ["KeyD"],            // Rotate clockwise
    hardDrop: ["Space"],              // Hard drop
  },
}
