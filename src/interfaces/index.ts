export interface Kline {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ExchangeConfig {
  baseUrl: string;
  endpoints: Record<string, string>;
}
