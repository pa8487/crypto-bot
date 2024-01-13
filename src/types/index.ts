import { BinanceKlineInterval, BinanceKlineSymbol } from '../enums/binance';
import { KuCoinKlineInterval, KuCoinKlineSymbol } from '../enums/kucoin';
import { BinanceCreateOrderResponse } from '../interfaces/binance';
import { KuCoinCreateOrderResponse } from '../interfaces/kucoin';

export type KlineSymbol = BinanceKlineSymbol | KuCoinKlineSymbol;

export type KlineInterval = BinanceKlineInterval | KuCoinKlineInterval;

export type Order = BinanceCreateOrderResponse | KuCoinCreateOrderResponse;

export type CreateOrderResponse =
  | BinanceCreateOrderResponse
  | KuCoinCreateOrderResponse;
