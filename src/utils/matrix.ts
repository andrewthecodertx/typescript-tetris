/**
 * Rotates a matrix in the given direction.
 * @param matrix - The matrix to rotate
 * @param direction - 1 for clockwise, -1 for counterclockwise
 * @returns A new rotated matrix
 */
export function rotateMatrix(matrix: number[][], direction: number): number[][] {
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
