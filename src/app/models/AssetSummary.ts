export class AssetSummary {
    constructor(
      public assetName: string,
      public ticker: string,
      public totalAmount: number,
      public averagePriceBought: number,
      public brokerName: string,
      public category: string,
      public currentPrice?: number, // Optional properties
      public priceSold?: number,    // can be marked with '?'
    ) {}

    
  // Method to calculate the gain
  calculateGain(): number {
    let finalPrice = this.priceSold ?? this.currentPrice ?? 0;
    return (finalPrice - this.averagePriceBought) * this.totalAmount;
  }
  }  