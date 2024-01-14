export class RelativeStrengthIndex {
  private period: number;

  constructor(period: number) {
    this.period = period;
  }

  public calculateRSI(closePrices: number[]): number[] {
    const gainValues: number[] = [];
    const lossValues: number[] = [];
    const rsiValues: number[] = [];

    for (let i = 1; i < closePrices.length; i++) {
      const priceDiff = closePrices[i] - closePrices[i - 1];
      if (priceDiff > 0) {
        gainValues.push(priceDiff);
        lossValues.push(0);
      } else if (priceDiff < 0) {
        gainValues.push(0);
        lossValues.push(Math.abs(priceDiff));
      } else {
        gainValues.push(0);
        lossValues.push(0);
      }
    }

    let avgGain = this.calculateAverage(gainValues.slice(0, this.period));
    let avgLoss = this.calculateAverage(lossValues.slice(0, this.period));

    for (let i = this.period; i < closePrices.length; i++) {
      const gain = gainValues[i - 1];
      const loss = lossValues[i - 1];

      avgGain = (avgGain * (this.period - 1) + gain) / this.period;
      avgLoss = (avgLoss * (this.period - 1) + loss) / this.period;

      const relativeStrength = avgGain / avgLoss;
      const rsIndex = 100 - 100 / (1 + relativeStrength);
      rsiValues.push(rsIndex);
    }

    return rsiValues.map((value) => +value.toFixed(value < 1 ? 8 : 2));
  }

  private calculateAverage(values: number[]): number {
    const sum = values.reduce((acc, value) => acc + value, 0);
    return sum / this.period;
  }
}
