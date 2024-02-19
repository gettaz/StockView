export class Asset {
  assetName: string;
  ticker: string;
  purchasePrice: number;
  amount: number;
  brokerName: string;
  dateBought: Date;
  dateSold: Date | null;
  currentPrice: number;
  priceSold: number | null;
  category: string;

  constructor(
    assetName: string,
    ticker: string,
    purchasePrice: number,
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
    this.purchasePrice = purchasePrice;
    this.amount = amount;
    this.brokerName = brokerName;
    this.dateBought = dateBought;
    this.dateSold = dateSold;
    this.currentPrice = currentPrice;
    this.priceSold = priceSold;
    this.category = category;
  }
}