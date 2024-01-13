import { config } from 'dotenv';
import { question, keyInSelect, keyInYN } from 'readline-sync';
import { CryptoAsset, Exchange, TradingStrategyEnum } from './enums';
import { BinanceKlineInterval } from './enums/binance';
import { ExchangeFactory } from './exchange-clients/ExchangeFactory';
import { TradingStrategyFactory } from './trading-strategies/TradingStrategyFactory';
import { KlineInterval } from './types';

const startTradingBot = async () => {
  const assets = Object.keys(CryptoAsset);
  const intervals = Object.keys(BinanceKlineInterval);
  const exchanges = Object.keys(Exchange);
  const tradingStrategies = Object.keys(TradingStrategyEnum);

  console.log('*********** Select Cryto Asset ***********');
  const asset: CryptoAsset = CryptoAsset[assets[keyInSelect(assets)]];

  console.log('*********** Select Exchange ***********');
  const exchange = Exchange[exchanges[keyInSelect(exchanges)]];

  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.SECRET_KEY;
  const isTestMode = keyInYN('Test Mode(Y/N): ') === 'n' ? false : true;

  console.log('*********** Select Trading Strategy Interval ***********');
  const interval: KlineInterval =
    BinanceKlineInterval[intervals[keyInSelect(intervals)]];

  console.log('*********** Select Trading Strategy ***********');
  const strategy: TradingStrategyEnum =
    TradingStrategyEnum[tradingStrategies[keyInSelect(tradingStrategies)]];

  const riskPerTrade = +question('Enter USDT amount per trade: ');
  const takeProfitPercentage = +question('Enter Take Profit percentage: ');
  const stopLossPercentage = +question('Enter Stop Loss percentage: ');

  const exchangeClient = ExchangeFactory.getExchangeClient(
    exchange,
    apiKey,
    apiSecret,
    isTestMode
  );

  const tradingStrategy = TradingStrategyFactory.getTradingStrategyInstance({
    exchangeClient,
    asset,
    riskPerTrade,
    stopLossPercentage,
    takeProfitPercentage,
    interval,
    tradingStrategy: strategy
  });

  await tradingStrategy.startTrading();
};

config();
startTradingBot();
