export class Asset {
  assetName: string;
  ticker: string;
  priceBought: number;
  amount: number;
  brokerName: string;
  dateBought: Date;
  dateSold: Date | null;
  currentPrice: number;

  constructor(
    assetName: string,
    ticker: string,
    priceBought: number,
    amount: number,
    brokerName: string,
    dateBought: Date,
    dateSold: Date | null,
    currentPrice: number
  ) {
    this.assetName = assetName;
    this.ticker = ticker;
    this.priceBought = priceBought;
    this.amount = amount;
    this.brokerName = brokerName;
    this.dateBought = dateBought;
    this.dateSold = dateSold;
    this.currentPrice = currentPrice;
  }
}
