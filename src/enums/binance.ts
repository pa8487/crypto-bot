export enum BinanceKlineSymbol {
  BTCUSDT = 'BTCUSDT',
  ETHUSDT = 'ETHUSDT',
  SHIBUSDT = 'SHIBUSDT',
  DOGEUSDT = 'DOGEUSDT',
  BCHUSDT = 'BCHUSDT',
  SOLUSDT = 'SOLUSDT'
}

export enum BinanceKlineInterval {
  _1m = '1m',
  _3m = '3m',
  _5m = '5m',
  _15m = '15m',
  _30m = '30m',
  _1h = '1h'
}

export enum BinanceOrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum BinanceOrderType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
  STOP_LOSS_LIMIT = 'STOP_LOSS_LIMIT',
  TAKE_PROFIT_LIMIT = 'TAKE_PROFIT_LIMIT',
  LIMIT_MAKER = 'LIMIT_MAKER'
}

export enum BinanceSelfTradePreventionMode {
  EXPIRE_TAKER = 'EXPIRE_TAKER',
  EXPIRE_MAKER = 'EXPIRE_MAKER',
  EXPIRE_BOTH = 'EXPIRE_BOTH',
  NONE = 'NONE'
}

export enum BinanceNewOrderRespType {
  ACK = 'ACK',
  RESULT = 'RESULT',
  FULL = 'FULL'
}
