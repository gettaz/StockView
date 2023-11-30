import { TimelineSummary } from './TimelineSummary';

export interface PortfolioTimelineSummary {
    type: 'all' | 'category' | 'broker';
    summaries: TimelineSummary[]; // Array of summaries for categories or brokers
  }
  