export class Asset {
  assetName: string;
  ticker: string;
  priceBought: number;
  amount: number;
  brokerName: string;
  dateBought: Date;
  dateSold: Date | null;
  currentPrice: number;
  priceSold: number | null;
  category: string;


  // Method to calculate the gain
  calculateGain(): number {
    let finalPrice = this.priceSold !== null ? this.priceSold : this.currentPrice;
    return (finalPrice - this.priceBought) * this.amount;
  }
  constructor(
    assetName: string,
    ticker: string,
    priceBought: number,
    amount: number,
    brokerName: string,
    dateBought: Date,
    dateSold: Date | null,
    currentPrice: number,
    priceSold: number | null,
    category: string = 'No Category'
  ) {
    this.assetName = assetName;
    this.ticker = ticker;
    this.priceBought = priceBought;
    this.amount = amount;
    this.brokerName = brokerName;
    this.dateBought = dateBought;
    this.dateSold = dateSold;
    this.currentPrice = currentPrice;
    this.priceSold = priceSold;
    this.category = category;
  }
}