export type Sentiment = 'happy' | 'sad' | 'neutral' | 'angry';

export interface Note {
  id: string;
  text: string;
  sentiment: Sentiment;
  dateCreated: string;
}

export interface NoteQueryResults {
  items: Note[];
  nextToken?: string;
  scannedCount?: number;
}