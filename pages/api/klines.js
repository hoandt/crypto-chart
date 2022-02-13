// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import React, { useEffect, useState } from "react";
export const isBrowser = typeof window !== "undefined";
import axios from "axios";
import { array_sum } from "../../utils/functions";
const getData = async (url) => {
  try {
    const response = await axios.get(url);
    const { data } = response;
    //row STT
    let seri = 0;
    //VWAP SETUP
    const full_cumulate_tpv = Array();
    const full_cumulate_vol = [];
    const full_5min_VWAP = Array();
    const full_15min_VWAP = Array();

    //EMA9 SETUP
    const smoothing_const = 0.2; // (2/(9 days+1))
    const full_EMA9 = Array();

    //CLOSING PRICE
    const full_close_prices = Array();

    //RSI SETUP
    const full_gain = Array();
    const full_loss = Array();
    const full_avg_gain = [];
    const full_avg_loss = [];
    const rsi_14 = [];
    const average_gain_loss = [];
    //start
    const klines = data.map((kline, i) => {
      const temp = [];
      i > 13 ? temp.push(i - 14) : temp.push("-");
      /**VWAP */
      let typicalPrice_x_volume =
        ((parseFloat(kline[2]) + parseFloat(kline[3]) + parseFloat(kline[4])) /
          3) *
        parseFloat(kline[5]);

      full_cumulate_tpv.push(typicalPrice_x_volume);
      full_cumulate_vol.push(parseFloat(kline[5]));
      let row_cumulate_tpv = []; //reset to zero for each row
      let row_cumulate_vol = [];
      let VWAP_5min = 0;
      let VWAP_15min = 0;

      /* VWAP 5 MIN */
      if (seri >= 4) {
        row_cumulate_tpv = full_cumulate_tpv
          .slice(seri - 4, seri + 5)
          .reduce((prev, current) => prev + current);
        row_cumulate_vol = full_cumulate_vol
          .slice(seri - 4, seri + 5)
          .reduce((prev, current) => prev + current);

        VWAP_5min = row_cumulate_tpv / row_cumulate_vol;
        full_5min_VWAP.push(VWAP_5min);
      }

      /* VWAP 15 MIN */
      if (seri >= 14) {
        row_cumulate_tpv = full_cumulate_tpv
          .slice(seri - 14, seri + 15)
          .reduce((prev, current) => prev + current);
        row_cumulate_vol = full_cumulate_vol
          .slice(seri - 14, seri + 15)
          .reduce((prev, current) => prev + current);
        VWAP_15min = row_cumulate_tpv / row_cumulate_vol;
        full_15min_VWAP.push(VWAP_15min);
      }

      /* FULL CLOSE PRICE */
      full_close_prices.push(kline[4]);

      /* EMA 9 */

      if (seri >= 8) {
        if (full_EMA9.length == 0) {
          let slice_sum_ema9 = full_close_prices
            .slice(seri - 8, seri + 9)
            .reduce((prev, current) => prev * 1.0 + current * 1.0);

          full_EMA9.push(slice_sum_ema9 / 9.0);
        } else {
          let cumulative_ema9 =
            full_EMA9[seri - 9] +
            (full_close_prices[seri] - full_EMA9[seri - 9]) * smoothing_const;
          full_EMA9.push(cumulative_ema9);
        }
      }

      /* RSI 14  & Average_gain_loss */
      let gain = 0;
      let rs = 0;
      let avg_grande3_div_avg_gain_loss = 0;
      if (seri >= 1) {
        /** Get 14 periods gain/loss */
        gain = full_close_prices[seri] - full_close_prices[seri - 1];
        if (gain > 0) {
          full_gain.push(gain * 1.0);
          full_loss.push(0.0);
        } else {
          full_gain.push(0.0);
          full_loss.push(gain * -1.0);
        }
        /** RSI = Avg 14 Gain/Avg 14 Loss*/
        if (seri >= 14) {
          if (seri == 14) {
            full_avg_gain.push(array_sum(full_gain, seri - 14, seri) / 14);
            full_avg_loss.push(array_sum(full_loss, seri - 14, seri) / 14);
            rs =
              array_sum(full_gain, seri - 14, seri) /
              14 /
              (array_sum(full_loss, seri - 14, seri) / 14);

            rsi_14.push(100 - 100 / (1 + rs));
          } else {
            full_avg_gain.push(
              (full_avg_gain[seri - 15] * 13 + full_gain[seri - 1]) / 14
            );
            full_avg_loss.push(
              (full_avg_loss[seri - 15] * 13 + full_loss[seri - 1]) / 14
            );
            rs =
              (full_avg_gain[seri - 15] * 13 + full_gain[seri - 1]) /
              14 /
              ((full_avg_loss[seri - 15] * 13 + full_loss[seri - 1]) / 14);
            rsi_14.push(100 - 100 / (1 + rs));
          }
          //Average gain loss
          average_gain_loss.push(
            array_sum(full_gain, seri - 14, seri) /
              14 /
              (array_sum(full_loss, seri - 14, seri) / 14)
          );
        } else {
        }
      }

      // STRATEGIES
      // if ($average_gain_loss[$seri-1] != 0)
      //  $avg_grande3_div_avg_gain_loss = ((sqrt(pow($d["close_price"]-$VWAP_5min,2))+sqrt(pow($d["close_price"]-$VWAP_15min,2))+sqrt(pow($d["close_price"]-$full_EMA9[$seri-8],2)))/3)/$average_gain_loss[$seri-1];
      //Math.abs
      if (seri > 13) {
        avg_grande3_div_avg_gain_loss =
          (Math.abs(kline[4] - VWAP_5min) +
            Math.abs(kline[4] - VWAP_15min) +
            Math.abs(kline[4] - full_EMA9[seri - 8])) /
          3 /
          average_gain_loss[seri - 14];
      }

      //Default values from KLINE BInance API
      for (let index = 0; index < 11; index++) {
        temp.push(kline[index]);
      }

      temp.push(VWAP_5min);
      temp.push(VWAP_15min);
      temp.push(full_EMA9[seri - 8]);
      temp.push(100 - 100 / (1 + rs));
      temp.push(avg_grande3_div_avg_gain_loss);
      seri++;

      return temp;
    });

    // setKline(klines.slice(13, klines.length));
    return klines;
  } catch (error) {
    console.log("[pages/ws.js]: ", error);
  }
};

const handler = async (req, res) => {
  const symbol = "MATICUSDT";
  const url = `https://www.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=20&endTime=1644467940000`;
  const data = await getData(url);

  res.status(200).json(data);
};

export default handler;
