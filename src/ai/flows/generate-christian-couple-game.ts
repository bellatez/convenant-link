// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating Christian couple games.
 *
 * The flow takes a mood as input and returns a list of faith-based game ideas.
 * - generateChristianCoupleGame - A function that generates Christian couple games.
 * - GenerateChristianCoupleGameInput - The input type for the generateChristianCoupleGame function.
 * - GenerateChristianCoupleGameOutput - The return type for the generateChristianCoupleGame function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChristianCoupleGameInputSchema = z.object({
  mood: z
    .string()
    .describe(
      'The desired mood for the game (e.g., fun, deep, spiritual, icebreaker, challenge, trivia)'
    ),
});

export type GenerateChristianCoupleGameInput = z.infer<
  typeof GenerateChristianCoupleGameInputSchema
>;

const GenerateChristianCoupleGameOutputSchema = z.object({
  gameIdeas: z
    .array(z.string())
    .describe('A list of faith-based game ideas for Christian couples.'),
});

export type GenerateChristianCoupleGameOutput = z.infer<
  typeof GenerateChristianCoupleGameOutputSchema
>;

export async function generateChristianCoupleGame(
  input: GenerateChristianCoupleGameInput
): Promise<GenerateChristianCoupleGameOutput> {
  return generateChristianCoupleGameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChristianCoupleGamePrompt',
  input: {schema: GenerateChristianCoupleGameInputSchema},
  output: {schema: GenerateChristianCoupleGameOutputSchema},
  prompt: `You are a game idea generator for Christian couples.

  Generate a list of faith-based game ideas based on the following mood:
  {{mood}}
  
  Return the game ideas in a JSON array.
  `,
});

const generateChristianCoupleGameFlow = ai.defineFlow(
  {
    name: 'generateChristianCoupleGameFlow',
    inputSchema: GenerateChristianCoupleGameInputSchema,
    outputSchema: GenerateChristianCoupleGameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
