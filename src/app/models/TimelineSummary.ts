import { TimelineDataItem } from './TimelineDataItem';

export interface TimelineSummary {
    name: string; // Name of the category or broker
    timelineData: TimelineDataItem[]; // Data over time for this category or broker
  }  