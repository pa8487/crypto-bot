import {
  BinanceKlineInterval,
  BinanceKlineSymbol,
  BinanceOrderSide,
  BinanceOrderType
} from '../enums/binance';
import {
  KuCoinKlineInterval,
  KuCoinKlineSymbol,
  KuCoinOrderSide,
  KuCoinOrderType
} from '../enums/kucoin';
import {
  BinanceCreateOrderRequest,
  BinanceCreateOrderResponse
} from '../interfaces/binance';
import {
  KuCoinCreateOrderRequest,
  KuCoinCreateOrderResponse
} from '../interfaces/kucoin';

export type KlineSymbol = BinanceKlineSymbol | KuCoinKlineSymbol;

export type KlineInterval = BinanceKlineInterval | KuCoinKlineInterval;

export type CreateOrderData =
  | BinanceCreateOrderRequest
  | KuCoinCreateOrderRequest;

export type Order = BinanceCreateOrderResponse | KuCoinCreateOrderResponse;

export type OrderSide = BinanceOrderSide | KuCoinOrderSide;

export type OrderType = BinanceOrderType | KuCoinOrderType;
