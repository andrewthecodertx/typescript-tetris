export class Piece {
  position: { x: number; y: number } // Current position of the piece in the arena
  matrix: number[][]                // Shape of the piece as a 2D array

  /**
   * Initializes a new piece with a position and shape matrix.
   * @param position - Initial position of the piece
   * @param matrix - Shape of the piece as a 2D array
   */
  constructor(position: { x: number; y: number }, matrix: number[][]) {
    this.position = position
    this.matrix = matrix
  }

  /**
   * Rotates the piece's matrix in the given direction.
   * @param direction - 1 for clockwise, -1 for counterclockwise
   */
  rotate(direction: number): void {
    this.matrix = this.rotateMatrix(this.matrix, direction)
  }

  /**
   * Rotates a matrix in the given direction.
   * @param matrix - The matrix to rotate
   * @param direction - 1 for clockwise, -1 for counterclockwise
   * @returns A new rotated matrix
   */
  private rotateMatrix(matrix: number[][], direction: number): number[][] {
    const rotatedMatrix = matrix.map((row) => [...row])

    // Transpose the matrix
    for (let y = 0; y < rotatedMatrix.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [rotatedMatrix[x][y], rotatedMatrix[y][x]] = [rotatedMatrix[y][x], rotatedMatrix[x][y]]
      }
    }

    // Reverse rows for clockwise, reverse columns for counterclockwise
    if (direction > 0) {
      rotatedMatrix.forEach((row) => row.reverse())
    } else {
      rotatedMatrix.reverse()
    }

    return rotatedMatrix
  }

  /**
   * Clones the piece instance.
   * @returns A new `Piece` instance with the same position and matrix
   */
  clone(): Piece {
    return new Piece(
      { x: this.position.x, y: this.position.y },
      this.matrix.map((row) => [...row])
    )
  }
}
