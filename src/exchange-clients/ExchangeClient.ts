import { CryptoAsset } from '../enums';
import { Kline, CreateOrderRequest } from '../interfaces';
import { CreateOrderResponse, KlineInterval, KlineSymbol } from '../types';

export abstract class ExchangeClient {
  protected readonly apiKey: string;
  protected readonly apiSecret: string;

  constructor({ apiKey, apiSecret }: { apiKey: string; apiSecret: string }) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
  }

  public abstract getAvailableAssetAmount(asset: CryptoAsset): Promise<number>;

  public abstract getKlines({
    asset,
    interval,
    limit
  }: {
    asset: CryptoAsset;
    interval: KlineInterval;
    limit: number;
  }): Promise<Kline[]>;

  public abstract getTicker(asset: CryptoAsset): Promise<number>;

  public abstract placeOrder(
    orderData: CreateOrderRequest
  ): Promise<CreateOrderResponse>;

  public abstract getSymbolUsdt(asset: CryptoAsset): KlineSymbol;
}
