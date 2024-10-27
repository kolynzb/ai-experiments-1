import { prisma } from "@/lib/prisma";
import { calculateSimilarity } from "@/lib/consine-similarity";
import { NextResponse } from "next/server";
import { getEmbeddings } from "@/lib/embeddings";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    // Convert search query into AI-understanding (numbers)
    const searchVector = await getEmbeddings(query);

    // Get all talents
    const talents = await prisma.talent.findMany();

    // Score each talent based on how well they match
    const scoredTalents = talents.map((talent) => {
      // How well do their skills match? (0-100%)
      const matchScore = calculateSimilarity(searchVector, talent.embedding);

      return {
        ...talent,
        matchScore,
      };
    });

    // Sort by match score and split into direct/related matches
    const sortedTalents = scoredTalents.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    return NextResponse.json({
      data: sortedTalents,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
