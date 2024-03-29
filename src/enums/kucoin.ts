export enum KuCoinKlineSymbol {
  BTCUSDT = 'BTC-USDT',
  THUSDT = 'ETH-USDT',
  SHIBUSDT = 'SHIB-USDT',
  DOGEUSDT = 'DOGE-USDT',
  BCHUSDT = 'BCH-USDT',
  SOLUSDT = 'SOL-USDT'
}

export enum KuCoinKlineInterval {
  _1m = '1min',
  _3m = '3min',
  _5m = '5min',
  _15m = '15min',
  _30m = '30min',
  _1h = '1hour'
}

export enum KuCoinOrderSide {
  BUY = 'buy',
  SELL = 'sell'
}

export enum KuCoinOrderType {
  LIMIT = 'limit',
  MARKET = 'market',
  STOP_LIMIT = 'stop_limit',
  STOP_MARKET = 'stop_market'
}
