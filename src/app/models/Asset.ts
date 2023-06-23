export class Asset {
    name: string;
    ticker: string;
    holdings: number;
    quantity: number;
    currentPrice: number;
    priceBought: number;
    overallInvestment: number;
    gain: number;
    val: number;
    broker: string;
    category: string;
  
    constructor(
      name: string,
      ticker: string,
      holdings: number,
      quantity: number,
      currentPrice: number,
      priceBought: number,
      overallInvestment: number,
      gain: number,
      val: number,
      broker: string,
      category: string
    ) {
      this.name = name;
      this.ticker = ticker;
      this.holdings = holdings;
      this.quantity = quantity;
      this.currentPrice = currentPrice;
      this.priceBought = priceBought;
      this.overallInvestment = overallInvestment;
      this.gain = gain;
      this.val = val;
      this.broker = broker;
      this.category = category;
    }
  }
  