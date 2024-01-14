export class BollingerBands {
  private period: number;
  private closePrices: number[];
  private smaValues: number[];
  private upperBandValues: number[];
  private lowerBandValues: number[];
  private stdDevFactor: number;

  constructor(period: number, stdDevFactor: number) {
    this.period = period;
    this.closePrices = [];
    this.smaValues = [];
    this.upperBandValues = [];
    this.lowerBandValues = [];
    this.stdDevFactor = stdDevFactor;
  }

  calculateBollingerBands(closePrices: number[]): {
    upper: number[];
    middle: number[];
    lower: number[];
  } {
    this.closePrices = closePrices;

    // Calculate SMA (Simple Moving Average)
    for (let i = this.period - 1; i < this.closePrices.length; i++) {
      const sma = this.calculateSMA(i);
      this.smaValues.push(sma);
    }

    // Calculate standard deviation
    for (let i = this.period - 1; i < this.closePrices.length; i++) {
      const stdDev = this.calculateStandardDeviation(i);
      const upperBand =
        this.smaValues[i - this.period + 1] + this.stdDevFactor * stdDev;
      const lowerBand =
        this.smaValues[i - this.period + 1] - this.stdDevFactor * stdDev;

      this.upperBandValues.push(upperBand);
      this.lowerBandValues.push(lowerBand);
    }

    return {
      upper: this.upperBandValues.map(
        (value) => +value.toFixed(value < 1 ? 8 : 2)
      ),
      middle: this.smaValues.map((value) => +value.toFixed(value < 1 ? 8 : 2)),
      lower: this.lowerBandValues.map(
        (value) => +value.toFixed(value < 1 ? 8 : 2)
      )
    };
  }

  private calculateSMA(index: number): number {
    const sum = this.closePrices
      .slice(index - this.period + 1, index + 1)
      .reduce((acc, price) => acc + price, 0);
    return sum / this.period;
  }

  private calculateStandardDeviation(index: number): number {
    const prices = this.closePrices.slice(index - this.period + 1, index + 1);
    const mean = this.calculateSMA(index);
    const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2));
    const variance =
      squaredDifferences.reduce((acc, val) => acc + val, 0) / this.period;
    return Math.sqrt(variance);
  }
}
