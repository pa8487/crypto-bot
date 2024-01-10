import { CryptoAsset } from '../enums';
import { ExchangeClient } from '../exchange-clients/ExchangeClient';
import { KlineInterval, KlineSymbol } from '../types';

export abstract class TradingStrategy {
  protected readonly riskPerTrade: number;
  protected readonly maxDrawdownLimit: number;
  protected readonly exchangeClient: ExchangeClient;
  protected readonly symbol: KlineSymbol;
  protected readonly interval: KlineInterval;

  protected constructor({
    riskPerTrade,
    maxDrawdownLimit,
    exchangeClient,
    symbol,
    interval
  }: {
    riskPerTrade: number;
    maxDrawdownLimit: number;
    exchangeClient: ExchangeClient;
    symbol: KlineSymbol;
    interval: KlineInterval;
  }) {
    this.riskPerTrade = riskPerTrade;
    this.maxDrawdownLimit = maxDrawdownLimit;
    this.exchangeClient = exchangeClient;
    this.symbol = symbol;
    this.interval = interval;
  }

  public abstract startTrading(): Promise<void>;

  public pauseTrading(interval: number): Promise<any> {
    console.log(
      `Max Drawdown limit of ${this.maxDrawdownLimit} has reached, trading paused for ${interval} milliseconds`
    );
    return new Promise((res) => setTimeout(res, interval));
  }

  public isDrawdownLimitReached({
    currentAmount,
    peakAmount
  }: {
    currentAmount: number;
    peakAmount: number;
  }): boolean {
    const drawdown = (peakAmount - currentAmount) / peakAmount;
    return drawdown >= this.maxDrawdownLimit;
  }
}
