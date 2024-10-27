import { pipeline } from '@xenova/transformers';
import { PrismaClient, Talent } from '@prisma/client';

const prisma = new PrismaClient();

// Load the summarization model
async function loadSummarizer() {
  const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-12-6');
  return summarizer;
}

// Function to generate summaries
async function summarizeTalentProfiles() {
  const summarizer = await loadSummarizer();

  // Fetch all talents from the database
  const talents: Talent[] = await prisma.talent.findMany();

  // Loop through each talent and create summaries
  const talentSummaries = await Promise.all(
    talents.map(async (talent) => {
      const textToSummarize = `
        Bio: ${talent.bio || ''}
        Skills: ${talent.skills.join(', ')}
        Experience: ${talent.experience.join('. ')}
        Education: ${talent.education || ''}
        Certifications: ${talent.certifications.join(', ')}
      `;

      // Generate a summary for each talent profile
      const summary = await summarizer(textToSummarize, { max_length: 60, min_length: 30 });
      return {
        id: talent.id,
        summary: summary[0]?.summary_text || '',
      };
    })
  );

  // Optionally, update the database with the generated summaries
  await Promise.all(
    talentSummaries.map(({ id, summary }) =>
      prisma.talent.update({
        where: { id },
        data: { summary },
      })
    )
  );

  console.log('Profile summarization completed successfully');
}

summarizeTalentProfiles()
  .catch((error) => console.error('Error generating summaries:', error))
  .finally(async () => await prisma.$disconnect());
