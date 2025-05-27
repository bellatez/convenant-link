// This file is machine-generated - edit with care!

'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a Christian couple game.
 *
 * The flow takes a mood as input and returns a single faith-based game idea
 * with instructions and benefits.
 * - generateChristianCoupleGame - A function that generates a Christian couple game.
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
  name: z.string().describe('The name of the faith-based game.'),
  instructions: z.string().describe('Detailed instructions on how to play the game.'),
  benefits: z.string().describe('How the game will help the couple or group.'),
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
  prompt: `You are a creative game designer specializing in games for Christian couples.

  Generate ONE faith-based game idea based on the following mood: {{mood}}.

  For the game, provide:
  1. A catchy and relevant "name".
  2. Detailed "instructions" on how to play the game.
  3. The "benefits" of playing this game for the couple or group, focusing on aspects like communication, spiritual growth, bonding, or understanding.

  Ensure the instructions are clear and easy to follow.
  The benefits should highlight the positive impact of the game.
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
