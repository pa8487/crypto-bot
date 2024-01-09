import axios, { AxiosRequestConfig } from 'axios';
import { createHmac } from 'crypto';
import { URLSearchParams } from 'url';
import { ApiRequestMethod, CryptoAsset, Exchange } from '../enums';
import { ExchangeConfig, Kline } from '../interfaces';
import { ExchangeClient } from './ExchangeClient';
import { getExchangeConfig } from '../config';
import { ApiRequest, ApiResponse, KlineResponse } from '../types/binance';
import { AccountResponse, Balance } from '../interfaces/binance';
import { BinanceKlineInterval, BinanceKlineSymbol } from '../enums/binance';

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
    symbol,
    interval,
    limit
  }: {
    symbol: BinanceKlineSymbol;
    interval: BinanceKlineInterval;
    limit: number;
  }): Promise<Kline[]> {
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
      console.log(`Error calling API: ${error.message}`);
      return error;
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
      console.log(`Error calling API: ${error.message}`);
      return error;
    }
  }

  private getRequestSignature(params: any): string {
    const queryString = new URLSearchParams(params).toString();
    return createHmac('sha256', this.apiSecret)
      .update(queryString)
      .digest('hex');
  }
}