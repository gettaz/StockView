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
  categoryName: string;
  id: number | null;

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
    categoryName: string = 'No Category',
    id: number| null
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
    this.categoryName = categoryName;
    this.id = id;
  }
}