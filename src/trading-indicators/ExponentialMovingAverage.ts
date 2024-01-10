export class ExponentialMovingAverage {
  private readonly period: number;
  private readonly smoothingFactor: number;

  constructor(period: number) {
    this.period = period;
    this.smoothingFactor = 2 / (period + 1);
  }

  public calculateEMA(closePrices: number[]): number[] {
    const ema: number[] = [];

    // If there are not enough prices for EMA, use SMA for the initial period
    if (closePrices.length < this.period) {
      const sma = this.calculateSMA(closePrices);
      ema.push(...sma);
      return ema;
    }

    // Initial EMA calculation
    let sum = 0;
    for (let i = 0; i < this.period; i++) {
      sum += closePrices[i];
    }
    const initialSMA = sum / this.period;
    ema.push(initialSMA);

    // EMA calculation
    for (let i = this.period; i < closePrices.length; i++) {
      const currentPrice = closePrices[i];
      const prevEMA = ema[i - this.period];
      const currentEMA =
        this.smoothingFactor * currentPrice +
        (1 - this.smoothingFactor) * prevEMA;
      ema.push(currentEMA);
    }

    return ema;
  }

  public calculateSMA(closePrices: number[]): number[] {
    const sma: number[] = [];
    for (let i = 0; i < closePrices.length - this.period + 1; i++) {
      const sum = closePrices
        .slice(i, i + this.period)
        .reduce((acc, price) => acc + price, 0);
      sma.push(sum / this.period);
    }
    return sma;
  }
}
