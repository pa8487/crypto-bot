import { CryptoAsset, OrderSide } from '../enums';
import { Kline } from '../interfaces';
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

    const rsiHelper = new RelativeStrengthIndex(
      this.technicalIndicatorParams.rsiPeriod
    );
    const bbandsHelper = new BollingerBands(
      this.technicalIndicatorParams.bbandsPeriod,
      this.technicalIndicatorParams.bbandsStdDevFactor
    );

    const startingUsdtBalance =
      await this.exchangeClient.getAvailableAssetAmount(CryptoAsset.USDT);
    console.log(`Starting USDT Balance: ${startingUsdtBalance}`);

    const assetBalance = await this.exchangeClient.getAvailableAssetAmount(
      this.asset
    );
    console.log(`Starting ${this.asset} balance: ${assetBalance}`);

    if (assetBalance > 0) {
      console.log(`Selling all available asset balance`);
      const sellOrder = await this.exchangeClient.placeOrder({
        asset: this.asset,
        quantity: +assetBalance.toFixed(2),
        side: OrderSide.SELL
      });
      console.log(JSON.stringify(sellOrder));
    }

    while (true) {
      try {
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
            const buyOrder = await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.BUY,
              quantity: this.riskPerTrade
            });
            console.log(JSON.stringify(buyOrder));

            takeProfitPrice =
              (1 + this.takeProfitPercentage / 100) * currentPrice;
            stopLossPrice = (1 - this.stopLossPercentage / 100) * currentPrice;
            inPosition = true;
          } catch (error: any) {
            console.log(`Error creating buy order: ${error.message}`);
          }
        } else if (
          currentPrice >= bbands.upper[bbands.upper.length - 1] &&
          rsiValues[rsiValues.length - 1] >= 70 &&
          inPosition
        ) {
          console.log(
            `Sell Signal. Current Price: ${currentPrice}, BBAND Upper: ${
              bbands.upper[bbands.upper.length - 1]
            }, RSI: ${rsiValues[rsiValues.length - 1]}`
          );

          try {
            const sellOrder = await this.exchangeClient.placeOrder({
              asset: this.asset,
              side: OrderSide.SELL,
              quantity: +(
                await this.exchangeClient.getAvailableAssetAmount(this.asset)
              ).toFixed(2)
            });
            console.log(JSON.stringify(sellOrder));
            inPosition = false;
          } catch (error: any) {
            console.log(`Error creating sell order: ${error.message}`);
          }
        } else if (inPosition && currentPrice >= takeProfitPrice) {
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
            inPosition = false;
          } catch (error: any) {
            console.log(`Error creating sell order: ${error.message}`);
          }
        } else if (inPosition && currentPrice <= stopLossPrice) {
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
            inPosition = false;
          } catch (error: any) {
            console.log(`Error creating sell order: ${error.message}`);
          }
        }
      } catch (error: any) {
        console.log(`Error occured during trading: ${error.message}`);
      }

      const currentUsdtBalance =
        await this.exchangeClient.getAvailableAssetAmount(CryptoAsset.USDT);
      console.log(
        `Current USDT Balance: ${currentUsdtBalance}. Profit: ${
          currentUsdtBalance - startingUsdtBalance
        }`
      );
      console.log();
      await this.pauseTrading(30000);
    }
  }
}
