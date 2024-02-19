import { TimelineDataItem } from './TimelineDataItem';

export interface TimelineSummary {
  name: string;
  components?: TimelineSummary[]; // Optional if you have nested summaries
  prices: TimelineDataItem[];
}
