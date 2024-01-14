import { CryptoAsset, TradingStrategyEnum } from '../enums';
import { ExchangeClient } from '../exchange-clients/ExchangeClient';
import { KlineInterval } from '../types';
import { BbandRsi } from './BbandsRsi';
import { TradingStrategy } from './TradingStrategy';

export class TradingStrategyFactory {
  public static getTradingStrategyInstance({
    exchangeClient,
    asset,
    interval,
    riskPerTrade,
    takeProfitPercentage,
    stopLossPercentage,
    tradingStrategy
  }: {
    exchangeClient: ExchangeClient;
    asset: CryptoAsset;
    interval: KlineInterval;
    riskPerTrade: number;
    takeProfitPercentage: number;
    stopLossPercentage: number;
    tradingStrategy: TradingStrategyEnum;
  }): TradingStrategy {
    switch (tradingStrategy) {
      case TradingStrategyEnum.BBANDSRSI:
        return new BbandRsi({
          exchangeClient,
          riskPerTrade,
          takeProfitPercentage,
          stopLossPercentage,
          interval,
          asset
        });
      default:
        throw new Error(`Unsupported Trading Strategy: ${tradingStrategy}`);
    }
  }
}
