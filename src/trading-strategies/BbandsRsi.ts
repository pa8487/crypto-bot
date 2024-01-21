import { CryptoAsset, OrderSide } from '../enums';
import { Kline } from '../interfaces';
import { BinanceCreateOrderResponse } from '../interfaces/binance';
import { BollingerBands } from '../trading-indicators/BollingerBands';
import { RelativeStrengthIndex } from '../trading-indicators/RelativeStrengthIndex';
import { TradingStrategy } from './TradingStrategy';

export class BbandRsi extends TradingStrategy {
  private readonly technicalIndicatorParams = {
    rsiPeriod: 13,
    bbandsPeriod: 30,
    bbandsStdDevFactor: 2
  };

  public async startTrading(): Promise<void> {
    let takeProfitPrice = 0.0;
    let stopLossPrice = 0.0;
    let inPosition = false;
    let buyBalance = 0;
    let sellBalance = 0;

    const rsiHelper = new RelativeStrengthIndex(
      this.technicalIndicatorParams.rsiPeriod
    );
    const bbandsHelper = new BollingerBands(
      this.technicalIndicatorParams.bbandsPeriod,
      this.technicalIndicatorParams.bbandsStdDevFactor
    );

    await this.sellInitialAssetBalance();

    while (true) {
      try {
        const assetBalance = +(
          await this.exchangeClient.getAvailableAssetAmount(this.asset)
        ).toFixed(8);

        const klines = await this.exchangeClient.getKlines({
          asset: this.asset,
          interval: this.interval,
          limit: 40
        });

        const closePrices = klines.map((kline: Kline) => kline.close);

        const rsiValues = rsiHelper.calculateRSI(closePrices);

        const bbands = bbandsHelper.calculateBollingerBands(closePrices);

        const currentPrice = await this.exchangeClient.getTicker(this.asset);

        console.log(
          `CurrentPrice: ${currentPrice}, RSI: ${
            rsiValues[rsiValues.length - 1]
          }, BBAND Lower: ${
            bbands.lower[bbands.lower.length - 1]
          }, BBAND Upper: ${bbands.upper[bbands.upper.length - 1]}`
        );

        if (
          currentPrice <= bbands.lower[bbands.lower.length - 1] &&
          rsiValues[rsiValues.length - 1] <= 30 &&
          !inPosition
        ) {
          console.log(
            `Buy Signal. Current Price: ${currentPrice}, BBAND Lower: ${
              bbands.lower[bbands.lower.length - 1]
            }, RSI: ${rsiValues[rsiValues.length - 1]}`
          );

          try {
            const buyOrder = (await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.BUY,
              quantity: this.riskPerTrade
            })) as BinanceCreateOrderResponse;
            console.log(JSON.stringify(buyOrder));

            takeProfitPrice =
              (1 + this.takeProfitPercentage / 100) * currentPrice;
            stopLossPrice = (1 - this.stopLossPercentage / 100) * currentPrice;
            inPosition = true;

            buyBalance += +buyOrder.cummulativeQuoteQty;
          } catch (error: any) {
            console.log(`Error creating buy order: ${JSON.stringify(error)}`);
          }
        } else if (
          inPosition &&
          this.isSellSignal({
            currentPrice,
            takeProfitPrice,
            stopLossPrice,
            bbandUpper: bbands.upper[bbands.upper.length - 1],
            rsi: rsiValues[rsiValues.length - 1]
          })
        ) {
          try {
            const sellOrder = (await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.SELL,
              quantity: assetBalance
            })) as BinanceCreateOrderResponse;
            console.log(JSON.stringify(sellOrder));

            inPosition = false;
            takeProfitPrice = 0;
            stopLossPrice = 0;

            sellBalance += +sellOrder.cummulativeQuoteQty;
          } catch (error: any) {
            console.log(`Error creating sell order: ${JSON.stringify(error)}`);
          }
        }
      } catch (error: any) {
        console.log(`Error occured during trading: ${JSON.stringify(error)}`);
      }

      console.log(
        `Current Buy Balance: ${buyBalance}, Sell Balance: ${sellBalance}, Profit: ${
          sellBalance - buyBalance
        }`
      );
      console.log();

      await this.pauseTrading(30000);
    }
  }

  private isSellSignal({
    currentPrice,
    takeProfitPrice,
    stopLossPrice,
    bbandUpper,
    rsi
  }: {
    currentPrice: number;
    takeProfitPrice: number;
    stopLossPrice: number;
    bbandUpper: number;
    rsi: number;
  }): boolean {
    // check takeProfitPrice reached
    if (currentPrice >= takeProfitPrice) {
      console.log(
        `Take Profit price reached. Current Price: ${currentPrice}, Take Profit Price: ${takeProfitPrice}`
      );
      return true;
    }

    // check stopLossPrice reached
    if (currentPrice <= stopLossPrice) {
      console.log(
        `Stop Loss price reached. Current Price: ${currentPrice}, Stop Loss Price: ${stopLossPrice}`
      );
      return true;
    }

    // check bbands and rsi conditions
    if (bbandUpper <= currentPrice && rsi >= 70) {
      console.log(
        `Sell Signal. Current Price: ${currentPrice}, BBAND Upper: ${bbandUpper}, RSI: ${rsi}`
      );
      return true;
    }

    return false;
  }
}
