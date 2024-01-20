export class BollingerBands {
  private period: number;
  private stdDevFactor: number;

  constructor(period: number, stdDevFactor: number) {
    this.period = period;
    this.stdDevFactor = stdDevFactor;
  }

  calculateBollingerBands(closePrices: number[]): {
    upper: number[];
    middle: number[];
    lower: number[];
  } {
    const smaValues = [];
    const upperBandValues = [];
    const lowerBandValues = [];

    // Calculate SMA (Simple Moving Average)
    for (let i = this.period - 1; i < closePrices.length; i++) {
      const sma = this.calculateSMA(i, closePrices);
      smaValues.push(sma);
    }

    // Calculate standard deviation
    for (let i = this.period - 1; i < closePrices.length; i++) {
      const stdDev = this.calculateStandardDeviation(i, closePrices);
      const upperBand =
        smaValues[i - this.period + 1] + this.stdDevFactor * stdDev;
      const lowerBand =
        smaValues[i - this.period + 1] - this.stdDevFactor * stdDev;

      upperBandValues.push(upperBand);
      lowerBandValues.push(lowerBand);
    }

    return {
      upper: upperBandValues.map((value) => +value.toFixed(value < 1 ? 8 : 4)),
      middle: smaValues.map((value) => +value.toFixed(value < 1 ? 8 : 4)),
      lower: lowerBandValues.map((value) => +value.toFixed(value < 1 ? 8 : 4))
    };
  }

  private calculateSMA(index: number, closePrices: number[]): number {
    const sum = closePrices
      .slice(index - this.period + 1, index + 1)
      .reduce((acc, price) => acc + price, 0);
    return sum / this.period;
  }

  private calculateStandardDeviation(
    index: number,
    closePrices: number[]
  ): number {
    const prices = closePrices.slice(index - this.period + 1, index + 1);
    const mean = this.calculateSMA(index, closePrices);
    const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2));
    const variance =
      squaredDifferences.reduce((acc, val) => acc + val, 0) / this.period;
    return Math.sqrt(variance);
  }
}
