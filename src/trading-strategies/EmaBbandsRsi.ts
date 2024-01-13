import { CryptoAsset, OrderSide } from '../enums';
import { Kline } from '../interfaces';
import { BollingerBands } from '../trading-indicators/BollingerBands';
import { ExponentialMovingAverage } from '../trading-indicators/ExponentialMovingAverage';
import { RelativeStrengthIndex } from '../trading-indicators/RelativeStrengthIndex';
import { TradingStrategy } from './TradingStrategy';

export class EmaBbandRsi extends TradingStrategy {
  private readonly technicalIndicatorParams = {
    emaPeriod: 10,
    rsiPeriod: 14,
    bbandsPeriod: 20,
    bbandsStdDevFactor: 2
  };

  public async startTrading(): Promise<void> {
    let takeProfitPrice = 0.0;
    let stopLossPrice = 0.0;

    const emaHelper = new ExponentialMovingAverage(
      this.technicalIndicatorParams.emaPeriod
    );
    const rsiHelper = new RelativeStrengthIndex(
      this.technicalIndicatorParams.rsiPeriod
    );
    const bbandsHelper = new BollingerBands(
      this.technicalIndicatorParams.bbandsPeriod,
      this.technicalIndicatorParams.bbandsStdDevFactor
    );

    while (true) {
      try {
        const klines = await this.exchangeClient.getKlines({
          asset: this.asset,
          interval: this.interval,
          limit: 40
        });

        const closePrices = klines.map((kline: Kline) => kline.close);
        const emaValues = emaHelper.calculateEMA(closePrices);
        const rsiValues = rsiHelper.calculateRSI(closePrices);
        const bbands = bbandsHelper.calculateBollingerBands(closePrices);
        const currentPrice = await this.exchangeClient.getTicker(this.asset);

        if (
          currentPrice <= bbands.lower[-1] &&
          rsiValues[-1] <= 30 &&
          currentPrice >= emaValues[-1]
        ) {
          console.log(
            `Buy Signal. Current Price: ${currentPrice}, EMA: ${
              emaValues[-1]
            }, BBAND Lower: ${bbands.lower[-1]}, RSI: ${rsiValues[-1]}`
          );

          try {
            const buyOrder = await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.BUY,
              quantity: this.riskPerTrade
            });
            console.log(JSON.stringify(buyOrder));

            takeProfitPrice =
              (1 + this.takeProfitPercentage / 100) * currentPrice;
            stopLossPrice = (1 - this.stopLossPercentage / 100) * currentPrice;
          } catch (error: any) {
            console.log(`Error creating buy order: ${error.message}`);
          }
        } else if (
          currentPrice >= bbands.upper[-1] &&
          rsiValues[-1] >= 70 &&
          currentPrice <= emaValues[-1]
        ) {
          console.log(
            `Sell Signal. Current Price: ${currentPrice}, EMA: ${
              emaValues[-1]
            }, BBAND Upper: ${bbands.upper[-1]}, RSI: ${rsiValues[-1]}`
          );

          try {
            const sellOrder = await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.SELL,
              quantity: this.riskPerTrade
            });
            console.log(JSON.stringify(sellOrder));
          } catch (error: any) {
            console.log(`Error creating sell order: ${error.message}`);
          }
        } else if (takeProfitPrice > 0 && currentPrice >= takeProfitPrice) {
          console.log(
            `Take Profit price reached. Current Price: ${currentPrice}, Take Profit Price: ${takeProfitPrice}`
          );

          try {
            const sellOrder = await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.SELL,
              quantity: this.riskPerTrade
            });
            console.log(JSON.stringify(sellOrder));
            takeProfitPrice = 0;
            stopLossPrice = 0;
          } catch (error: any) {
            console.log(`Error creating sell order: ${error.message}`);
          }
        } else if (stopLossPrice > 0 && currentPrice <= stopLossPrice) {
          console.log(
            `Stop Loss price reached. Current Price: ${currentPrice}, Stop Loss Price: ${stopLossPrice}`
          );

          try {
            const sellOrder = await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.SELL,
              quantity: this.riskPerTrade
            });
            console.log(JSON.stringify(sellOrder));
            takeProfitPrice = 0;
            stopLossPrice = 0;
          } catch (error: any) {
            console.log(`Error creating sell order: ${error.message}`);
          }
        }
      } catch (error: any) {
        console.log(`Error occured during trading: ${error.message}`);
      }

      await this.pauseTrading(30000);
    }
  }
}
