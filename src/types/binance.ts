import {
  AccountRequest,
  AccountResponse,
  BinanceCreateOrderRequest,
  BinanceCreateOrderResponse,
  KlineRequest,
  TickerRequest,
  TickerResponse
} from '../interfaces/binance';

export type ApiRequest =
  | AccountRequest
  | KlineRequest
  | BinanceCreateOrderRequest
  | TickerRequest;

export type KlineResponse = string[][];

export type ApiResponse =
  | AccountResponse
  | KlineResponse
  | BinanceCreateOrderResponse
  | TickerResponse;
