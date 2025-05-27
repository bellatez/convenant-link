'use server';

/**
 * @fileOverview Generates discussion topics for Christian couples with scripture references.
 *
 * - generateCouplesDiscussionTopic - A function that generates discussion topics.
 * - GenerateCouplesDiscussionTopicInput - The input type for the generateCouplesDiscussionTopic function.
 * - GenerateCouplesDiscussionTopicOutput - The return type for the generateCouplesDiscussionTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCouplesDiscussionTopicInputSchema = z.object({
  topicPreferences: z
    .string()
    .describe(
      'Preferences for the discussion topic, such as the desired theme, depth, or scripture focus.'
    ),
  meetingContext: z
    .string()
    .describe(
      'Information about the meeting, such as the date, attendees, and any recent events or discussions.'
    ),
});
export type GenerateCouplesDiscussionTopicInput = z.infer<
  typeof GenerateCouplesDiscussionTopicInputSchema
>;

const GenerateCouplesDiscussionTopicOutputSchema = z.object({
  topic: z.string().describe('The generated discussion topic.'),
  scriptureReferences: z
    .string()
    .describe('Relevant scripture references for the topic.'),
  suggestedQuestions: z
    .string()
    .describe('Suggested questions to guide the discussion.'),
});
export type GenerateCouplesDiscussionTopicOutput = z.infer<
  typeof GenerateCouplesDiscussionTopicOutputSchema
>;

export async function generateCouplesDiscussionTopic(
  input: GenerateCouplesDiscussionTopicInput
): Promise<GenerateCouplesDiscussionTopicOutput> {
  return generateCouplesDiscussionTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCouplesDiscussionTopicPrompt',
  input: {schema: GenerateCouplesDiscussionTopicInputSchema},
  output: {schema: GenerateCouplesDiscussionTopicOutputSchema},
  prompt: `You are a helpful AI assistant that generates engaging discussion topics for Christian couples.

  Based on the provided topic preferences and meeting context, generate a relevant and insightful discussion topic.

  Topic Preferences: {{{topicPreferences}}}
  Meeting Context: {{{meetingContext}}}

  Format the response with a topic, relevant scripture references, and suggested questions to facilitate a meaningful discussion.
  The scripture references should be in the format of book chapter:verse, example: John 3:16.
  `,
});

const generateCouplesDiscussionTopicFlow = ai.defineFlow(
  {
    name: 'generateCouplesDiscussionTopicFlow',
    inputSchema: GenerateCouplesDiscussionTopicInputSchema,
    outputSchema: GenerateCouplesDiscussionTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
