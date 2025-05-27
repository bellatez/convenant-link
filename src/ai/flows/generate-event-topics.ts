// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview Generates three distinct discussion topic proposals for Christian couple meetings.
 *
 * - generateEventTopics - A function that generates three discussion topics with scripture.
 * - GenerateEventTopicsOutput - The return type for the generateEventTopics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// No input schema needed for this version, but we can define an empty one for consistency or future use.
const GenerateEventTopicsInputSchema = z.object({}).optional(); 
export type GenerateEventTopicsInput = z.infer<typeof GenerateEventTopicsInputSchema>;


const TopicProposalSchema = z.object({
  topic: z.string().describe("A concise discussion topic title."),
  scriptureReference: z.string().describe("A relevant Bible scripture reference (e.g., John 3:16 or Proverbs 3:5-6)."),
});

const GenerateEventTopicsOutputSchema = z.array(TopicProposalSchema)
  .length(3)
  .describe("An array of exactly three distinct topic proposals, each with a topic and scripture reference.");

export type GenerateEventTopicsOutput = z.infer<typeof GenerateEventTopicsOutputSchema>;


export async function generateEventTopics(input?: GenerateEventTopicsInput): Promise<GenerateEventTopicsOutput> {
  return generateEventTopicsFlow(input || {});
}

const prompt = ai.definePrompt({
  name: 'generateEventTopicsPrompt',
  input: { schema: GenerateEventTopicsInputSchema },
  output: { schema: GenerateEventTopicsOutputSchema },
  prompt: `You are an AI assistant specializing in content for Christian couples.

  Generate exactly three distinct discussion topic proposals suitable for a Christian couples' meeting.
  For each proposal, provide:
  1. A 'topic' (a concise title for the discussion).
  2. A 'scriptureReference' (a relevant Bible verse or short passage, like 'Proverbs 3:5-6' or '1 Corinthians 13:4-7').

  Ensure the topics are varied, encourage meaningful conversation, and are appropriate for couples seeking to grow in their faith and relationship.
  The output must be an array of three objects, each containing "topic" and "scriptureReference".
  `,
});

const generateEventTopicsFlow = ai.defineFlow(
  {
    name: 'generateEventTopicsFlow',
    inputSchema: GenerateEventTopicsInputSchema,
    outputSchema: GenerateEventTopicsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
