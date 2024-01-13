import { Exchange } from '../enums';
import { BinanceExchangeClient } from './BinanceExchangeClient';
import { ExchangeClient } from './ExchangeClient';

export class ExchangeFactory {
  public static getExchangeClient(
    exchange: Exchange,
    apiKey: string,
    apiSecret: string,
    isTestMode: boolean
  ): ExchangeClient {
    switch (exchange) {
      case Exchange.BINANCE:
        return new BinanceExchangeClient({ apiKey, apiSecret, isTestMode });
      default:
        throw new Error(`Unsupported exchange: ${exchange}`);
    }
  }
}
