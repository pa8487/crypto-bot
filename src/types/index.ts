import { BinanceKlineInterval, BinanceKlineSymbol } from '../enums/binance';
import { KuCoinKlineInterval, KuCoinKlineSymbol } from '../enums/kucoin';

export type KlineSymbol = BinanceKlineSymbol | KuCoinKlineSymbol;

export type KlineInterval = BinanceKlineInterval | KuCoinKlineInterval;
