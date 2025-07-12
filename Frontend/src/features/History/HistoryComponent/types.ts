export interface HistoryEntry {
  id: string;
  date: string;
  readingType?: string;
  result?: string;
  question?: string;
  cards?: string[];
  summary?: string;
}
