import axios, { AxiosRequestConfig } from 'axios';
import { createHmac } from 'crypto';
import { URLSearchParams } from 'url';
import { ApiRequestMethod, CryptoAsset, Exchange, OrderSide } from '../enums';
import { CreateOrderRequest, ExchangeConfig, Kline } from '../interfaces';
import { ExchangeClient } from './ExchangeClient';
import { getExchangeConfig } from '../config';
import { ApiRequest, ApiResponse, KlineResponse } from '../types/binance';
import {
  AccountResponse,
  Balance,
  BinanceCreateOrderRequest,
  BinanceCreateOrderResponse,
  TickerResponse
} from '../interfaces/binance';
import {
  BinanceKlineInterval,
  BinanceKlineSymbol,
  BinanceOrderSide,
  BinanceOrderType
} from '../enums/binance';

export class BinanceExchangeClient extends ExchangeClient {
  private readonly config: ExchangeConfig;

  constructor({
    apiKey,
    apiSecret,
    isTestMode
  }: {
    apiKey: string;
    apiSecret: string;
    isTestMode: boolean;
  }) {
    super({ apiKey, apiSecret });

    this.config = getExchangeConfig(Exchange.BINANCE, isTestMode);
  }

  public async getAvailableAssetAmount(asset: CryptoAsset): Promise<number> {
    const accountData = (await this.privateApiRequest({
      params: { timestamp: Date.now() },
      endpoint: this.config.endpoints['account'],
      method: ApiRequestMethod.GET
    })) as AccountResponse;

    const availableAssetAmount = accountData.balances.filter(
      (balance: Balance) => balance.asset === asset
    )[0].free;

    return +availableAssetAmount;
  }

  public async getKlines({
    asset,
    interval,
    limit
  }: {
    asset: CryptoAsset;
    interval: BinanceKlineInterval;
    limit: number;
  }): Promise<Kline[]> {
    const symbol = this.getSymbolUsdt(asset);
    const klines = (await this.publicApiRequest({
      params: { symbol, interval, limit },
      endpoint: this.config.endpoints['klines'],
      method: ApiRequestMethod.GET
    })) as KlineResponse;

    const parsedKlines = klines.map((kline: string[]) => {
      return {
        open: +kline[1],
        high: +kline[2],
        low: +kline[3],
        close: +kline[4],
        volume: +kline[5]
      } as Kline;
    });

    return parsedKlines;
  }

  public async getTicker(asset: CryptoAsset): Promise<number> {
    const symbol = this.getSymbolUsdt(asset);
    const ticker = (await this.publicApiRequest({
      params: { symbol },
      method: ApiRequestMethod.GET,
      endpoint: this.config.endpoints['ticker']
    })) as TickerResponse;
    return +ticker.price;
  }

  public async placeOrder(
    createOrderRequest: CreateOrderRequest
  ): Promise<BinanceCreateOrderResponse> {
    if (!createOrderRequest.quantity || createOrderRequest.quantity <= 0) {
      throw new Error(`Invalid quantity: ${createOrderRequest.quantity}`);
    }
    const binanceCreateOrderRequest: BinanceCreateOrderRequest = {
      symbol: this.getSymbolUsdt(createOrderRequest.asset),
      side: BinanceOrderSide[createOrderRequest.side],
      type: BinanceOrderType.MARKET,
      timestamp: Date.now()
    };
    if (createOrderRequest.side === OrderSide.SELL) {
      binanceCreateOrderRequest.quantity = createOrderRequest.quantity;
    } else {
      binanceCreateOrderRequest.quoteOrderQty = createOrderRequest.quantity;
    }
    console.log(`Order Request: ${JSON.stringify(binanceCreateOrderRequest)}`);
    const orderResponse = (await this.privateApiRequest({
      params: binanceCreateOrderRequest,
      endpoint: this.config.endpoints['order'],
      method: ApiRequestMethod.POST
    })) as BinanceCreateOrderResponse;
    return orderResponse;
  }

  public getSymbolUsdt(asset: CryptoAsset): BinanceKlineSymbol {
    return BinanceKlineSymbol[asset + CryptoAsset.USDT];
  }

  private async privateApiRequest({
    params,
    endpoint,
    method
  }: {
    params: ApiRequest;
    endpoint: string;
    method: ApiRequestMethod;
  }): Promise<ApiResponse> {
    try {
      const signature = this.getRequestSignature(params);
      const requestConfig: AxiosRequestConfig = {
        method,
        url: this.config.baseUrl + endpoint,
        params: { ...params, signature },
        headers: { 'X-MBX-APIKEY': this.apiKey }
      };
      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error: any) {
      console.log(`Error calling API: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private async publicApiRequest({
    params,
    endpoint,
    method
  }: {
    params: ApiRequest;
    endpoint: string;
    method: ApiRequestMethod;
  }): Promise<ApiResponse> {
    try {
      const requestConfig: AxiosRequestConfig = {
        method,
        url: this.config.baseUrl + endpoint,
        params
      };
      const response = await axios.request(requestConfig);
      return response.data;
    } catch (error: any) {
      console.log(`Error calling API: ${JSON.stringify(error)}`);
      throw error;
    }
  }

  private getRequestSignature(params: any): string {
    const queryString = new URLSearchParams(params).toString();
    return createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
  }
}
