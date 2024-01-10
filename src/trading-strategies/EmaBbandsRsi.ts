import { CryptoAsset } from '../enums';
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
    let peakUsdtAmount = 0;
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
        const currentUsdtAmount =
          await this.exchangeClient.getAvailableAssetAmount(CryptoAsset.BTC);
        if (currentUsdtAmount > peakUsdtAmount) {
          peakUsdtAmount = currentUsdtAmount;
        }

        if (
          this.isDrawdownLimitReached({
            currentAmount: currentUsdtAmount,
            peakAmount: peakUsdtAmount
          })
        ) {
          await this.pauseTrading(60 * 60 * 1000);
        }

        const klines = await this.exchangeClient.getKlines({
          symbol: this.symbol,
          interval: this.interval,
          limit: 40
        });

        const closePrices = klines.map((kline: Kline) => kline.close);
        const emaValues = emaHelper.calculateEMA(closePrices);
        const rsiValues = rsiHelper.calculateRSI(closePrices);
        const bbands = bbandsHelper.calculateBollingerBands(closePrices);

        if (
          closePrices[-1] <= bbands.lower[-1] &&
          rsiValues[-1] <= 30 &&
          closePrices[-1] >= emaValues[-1]
        ) {
          console.log(
            `Buy Signal. Close Price: ${closePrices[-1]}, EMA: ${
              emaValues[-1]
            }, BBAND Lower: ${bbands.lower[-1]}, RSI: ${rsiValues[-1]}`
          );

          const tradeAmountInUsdt = this.riskPerTrade * currentUsdtAmount;
          const buyOrder = await this.exchangeClient.placeOrder({
            symbol: this.symbol
          });
        }
      } catch (error: any) {}
    }
  }
}
