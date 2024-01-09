import { Exchange } from '../enums';
import { ExchangeConfig } from '../interfaces';
import * as binanceConfig from '../config/binance';

export const getExchangeConfig = (
  exchange: Exchange,
  isTestMode: boolean
): ExchangeConfig => {
  switch (exchange) {
    case Exchange.BINANCE:
      return {
        baseUrl: isTestMode
          ? binanceConfig.testApiBaseUrl
          : binanceConfig.apiBaseUrl,
        endpoints: binanceConfig.endpoints
      };
    default:
      throw new Error('Unsupported exchange!');
  }
};
