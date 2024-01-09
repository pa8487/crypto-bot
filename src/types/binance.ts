import {
  AccountRequest,
  AccountResponse,
  KlineRequest
} from '../interfaces/binance';

export type ApiRequest = AccountRequest | KlineRequest;

export type KlineResponse = string[][];

export type ApiResponse = AccountResponse | KlineResponse;
