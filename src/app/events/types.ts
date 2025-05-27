
export interface Event {
  id: string;
  title: string;
  date: Date;
  time: string; // HH:mm format
  description: string;
  location?: string;
}
