export interface TimelineDataItem {
    name: any;
    map(arg0: (item: any) => { x: any; y: any; }): any;
    date: string; // Assuming date is in a string format, e.g., '2023-01-01'
    price: number;
  }  