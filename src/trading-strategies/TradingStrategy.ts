import { CryptoAsset, OrderSide } from '../enums';
import { ExchangeClient } from '../exchange-clients/ExchangeClient';
import { KlineInterval, KlineSymbol } from '../types';

export abstract class TradingStrategy {
  protected readonly riskPerTrade: number;
  protected readonly exchangeClient: ExchangeClient;
  protected readonly asset: CryptoAsset;
  protected readonly interval: KlineInterval;
  protected readonly takeProfitPercentage: number;
  protected readonly stopLossPercentage: number;

  constructor({
    riskPerTrade,
    exchangeClient,
    asset,
    interval,
    takeProfitPercentage,
    stopLossPercentage
  }: {
    riskPerTrade: number;
    exchangeClient: ExchangeClient;
    asset: CryptoAsset;
    interval: KlineInterval;
    takeProfitPercentage: number;
    stopLossPercentage: number;
  }) {
    this.riskPerTrade = riskPerTrade;
    this.exchangeClient = exchangeClient;
    this.asset = asset;
    this.interval = interval;
    this.takeProfitPercentage = takeProfitPercentage;
    this.stopLossPercentage = stopLossPercentage;
  }

  public abstract startTrading(): Promise<void>;

  public pauseTrading(interval: number): Promise<any> {
    return new Promise((res) => setTimeout(res, interval));
  }

  protected async sellInitialAssetBalance() {
    try {
      const assetBalance = +(
        await this.exchangeClient.getAvailableAssetAmount(this.asset)
      ).toFixed(8);
      console.log(`Starting ${this.asset} balance: ${assetBalance}`);

      console.log(`Selling all available asset balance`);
      const sellOrder = await this.exchangeClient.placeOrder({
        asset: this.asset,
        quantity: assetBalance,
        side: OrderSide.SELL
      });

      console.log(JSON.stringify(sellOrder));
    } catch (erorr: any) {
      console.log(`Error selling asset: ${JSON.stringify(erorr)}`);
    }
  }
}
