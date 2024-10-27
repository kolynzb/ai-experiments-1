// This function measures how similar two pieces of text are (0-100%)
export function calculateSimilarity(vectorA: number[], vectorB: number[]): number {
  const dotProduct = vectorA.reduce((sum, a, i) => sum + a * vectorB[i], 0)
  const magnitudeA = Math.sqrt(vectorA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vectorB.reduce((sum, b) => sum + b * b, 0))
  
  return (dotProduct / (magnitudeA * magnitudeB) + 1) * 50 // Convert to percentage
}
