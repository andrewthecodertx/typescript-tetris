import { Piece } from "../core/Piece"

/**
 * Detects if a piece collides with the game arena or its boundaries.
 * @param arena - The game arena grid
 * @param piece - The piece to check for collisions
 * @returns `true` if there is a collision, otherwise `false`
 */
export function detectCollision(arena: number[][], piece: Piece): boolean {
  const { matrix, position } = piece

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (
        matrix[y][x] !== 0 && (position.y + y >= 0 && // Check if the cell is part of the piece
          (
            arena[y + position.y]?.[x + position.x] !== 0 || // Collides with filled cell
            arena[y + position.y]?.[x + position.x] === undefined // Out of bounds
          )
        )) {
        return true
      }
    }
  }

  return false
}
