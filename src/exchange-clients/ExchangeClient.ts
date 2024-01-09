import { CryptoAsset } from '../enums';
import { Kline } from '../interfaces';
import { KlineInterval, KlineSymbol } from '../types';

export abstract class ExchangeClient {
  protected readonly apiKey: string;
  protected readonly apiSecret: string;

  constructor({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  public abstract getAvailableAssetAmount(asset: CryptoAsset): Promise<number>;

  public abstract getKlines({
    symbol,
    interval,
    limit
  }: {
    symbol: KlineSymbol;
    interval: KlineInterval;
    limit: number;
  }): Promise<Kline[]>;
}
