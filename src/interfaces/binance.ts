import { CryptoAsset } from '../enums';
import { BinanceKlineInterval, BinanceKlineSymbol } from '../enums/binance';

export interface AccountRequest {
  timestamp: number;
}

export interface KlineRequest {
  symbol: BinanceKlineSymbol;
  interval: BinanceKlineInterval;
  limit?: number;
}

export interface Balance {
  asset: CryptoAsset;
  free: string;
  locked: string;
}

export interface AccountResponse {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  commissionRates: {
    maker: string;
    taker: string;
    buyer: string;
    seller: string;
  };
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  brokered: boolean;
  requireSelfTradePrevention: boolean;
  updateTime: number;
  accountType: string;
  balances: Balance[];
  permissions: string[];
}
