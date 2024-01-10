import {
  AccountRequest,
  AccountResponse,
  BinanceCreateOrderRequest,
  BinanceCreateOrderResponse,
  KlineRequest
} from '../interfaces/binance';

export type ApiRequest =
  | AccountRequest
  | KlineRequest
  | BinanceCreateOrderRequest;

export type KlineResponse = string[][];

export type ApiResponse =
  | AccountResponse
  | KlineResponse
  | BinanceCreateOrderResponse;
