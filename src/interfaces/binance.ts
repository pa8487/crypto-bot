import { CryptoAsset } from '../enums';
import {
  BinanceKlineInterval,
  BinanceKlineSymbol,
  BinanceNewOrderRespType,
  BinanceOrderSide,
  BinanceOrderType,
  BinanceSelfTradePreventionMode
} from '../enums/binance';
import { KlineSymbol } from '../types';

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

export interface OrderFill {
  price: string;
  qty: string;
  commission: string;
  commissionAsset: CryptoAsset;
  tradeId: number;
}

export interface BinanceCreateOrderRequest {
  symbol: BinanceKlineSymbol;
  side: BinanceOrderSide;
  type: BinanceOrderType;
  timeInForce?: string;
  quantity?: number;
  quoteOrderQty?: number;
  price?: number;
  newClientOrderId?: string;
  stopPrice?: number;
  trailingDelta?: number;
  icebergQty?: number;
  selfTradePreventionMode?: BinanceSelfTradePreventionMode;
  newOrderRespType?: BinanceNewOrderRespType;
  recvWindow?: number;
  timestamp?: number;
}

export interface BinanceCreateOrderResponse {
  symbol: BinanceKlineSymbol;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime: number;
  price?: string;
  origQty?: string;
  executedQty?: string;
  cummulativeQuoteQty?: string;
  status?: string;
  timeInForce?: string;
  type?: BinanceOrderType;
  side?: BinanceOrderType;
  workingTime?: number;
  selfTradePreventionMode?: BinanceSelfTradePreventionMode;
  fills?: OrderFill[];
}

export interface TickerRequest {
  symbol: KlineSymbol;
}

export interface TickerResponse {
  symbol: KlineSymbol;
  price: string;
}
