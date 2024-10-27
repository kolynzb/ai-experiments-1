import { NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';
import { PrismaClient, Talent } from '@prisma/client';

const prisma = new PrismaClient();

// Load the summarization model
async function loadSummarizer() {
  const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
  return summarizer;
}

// API route handler
export async function GET() {
  try {
    const summarizer = await loadSummarizer();

    // Fetch all talents from the database
    const talents: Talent[] = await prisma.talent.findMany();

    // Loop through each talent and create summaries
    const talentSummaries = await Promise.all(
      talents.slice(0,4).map(async (talent) => {
        const textToSummarize = `
          Title: ${talent.title || ''}
          Bio: ${talent.bio || ''}
          Skills: ${talent.skills.join(', ')}
          Experience In Years: ${talent.experienceYears || ''}
          Experience: ${talent.experience.join('. ')}
          Education: ${talent.education || ''}
          Certifications: ${talent.certifications.join(', ')}
        `;

        // Generate a summary for each talent profile
        const summary = await summarizer(textToSummarize, { max_length: 90, min_length: 30 });
        return {
          id: talent.id,
          summary: summary[0] ||'',
        };
      })
    );

    // // Update the database with the generated summaries
    // await Promise.all(
    //   talentSummaries.map(({ id, summary }) =>
    //     prisma.talent.update({
    //       where: { id },
    //       data: { summary },
    //     })
    //   )
    // );

    return NextResponse.json({ message: 'Profile summarization completed successfully',talentSummaries }, { status: 200 });
  } catch (error) {
    console.error('Error generating summaries:', error);
    return NextResponse.json({ error: 'An error occurred while generating summaries' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
