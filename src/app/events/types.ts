
export interface TopicProposal {
  id: string; // Unique ID for the proposal, useful for keys and radio values
  topic: string;
  scriptureReference: string;
}

export interface Event {
  id:string;
  title: string;
  date: Date;
  time: string; // HH:mm format
  location?: string;
  suggestedTopics: TopicProposal[]; // Array of 3 generated topics
  selectedTopicId: string | null; // ID of the topic chosen by the organizer
}
