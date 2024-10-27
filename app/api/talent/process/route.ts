import { getEmbeddings } from "@/lib/embeddings";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

async function precomputeEmbeddings() {
  const talents = await prisma.talent.findMany();
  for (const talent of talents) {
    const textData = `${talent.bio} ${talent.skills.join(
      " "
    )} ${talent.experience.join(" ")} ${talent.title} with ${
      talent.experienceYears
    } of experience`;
    const embedding = await getEmbeddings(textData);
    await prisma.talent.update({
      where: { id: talent.id },
      data: { embedding },
    });
  }
}

export async function GET() {
  try {
    await precomputeEmbeddings();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
