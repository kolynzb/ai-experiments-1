// utils/embedding.js
import { pipeline } from "@xenova/transformers";

export async function getEmbeddings(text: string): Promise<number[]> {
  const model = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  // Get embeddings as a Tensor and convert it to a flat number array
  const tensor = await model(text, { pooling: "mean", normalize: true });
  const embeddingArray = tensor.data; // or tensor.array(), depending on your setup

  return Array.from(embeddingArray); // Convert to standard array if needed
}
