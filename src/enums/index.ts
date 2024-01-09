import { BinanceKlineSymbol } from './binance';
import { KuCoinKlineSymbol } from './kucoin';

export enum CryptoAsset {
  USDT = 'USDT',
  BTC = 'BTC',
  ETH = 'ETH',
  SHIB = 'SHIB',
  DOGE = 'DOGE',
  BCH = 'BCH',
  SOL = 'SOL'
}

export enum ApiRequestMethod {
  GET = 'get',
  POST = 'post'
}

export enum Exchange {
  BINANCE = 'BINANCE',
  KUCOIN = 'KUCOIN'
}
