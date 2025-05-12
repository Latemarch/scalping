import { BybitKline } from "@/types/type";
import { colors } from "../constants";

type VWAPData = {
  timestamp: number;
  value: number;
};

export function drawVWAP(
  ctx: CanvasRenderingContext2D | null,
  vwapData: VWAPData[],
  x: any,
  y: any,
  color: string = colors.blue
) {
  if (!ctx || vwapData.length === 0) return;

  ctx.beginPath();
  ctx.moveTo(x(new Date(vwapData[0].timestamp)), y(vwapData[0].value));

  for (let i = 1; i < vwapData.length; i++) {
    ctx.lineTo(x(new Date(vwapData[i].timestamp)), y(vwapData[i].value));
  }

  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

export function calculateVWAP(
  data: BybitKline[],
  period: number = 100
): VWAPData[] {
  if (data.length === 0) return [];

  const vwapData: VWAPData[] = [];

  // 각 캔들마다 해당 시점의 VWAP 계산
  for (let i = 0; i < data.length; i++) {
    if (i < period) continue;
    // 현재 캔들을 기준으로 이전 period개의 캔들 또는 처음부터 현재까지의 캔들 선택
    const startIdx = Math.max(0, i - period + 1);
    const periodData = data.slice(startIdx, i + 1);

    let cumulativeVolume = 0;
    let cumulativePriceVolume = 0;

    // 선택된 기간 내 캔들로 VWAP 계산
    for (let j = 0; j < periodData.length; j++) {
      const currentData = periodData[j];
      const typicalPrice = Number(currentData[4]);
      // 원래 공식: (고가 + 저가 + 종가) / 3
      // const typicalPrice = (Number(currentData[2]) + Number(currentData[3]) + Number(currentData[4])) / 3;
      const volume = Number(currentData[5]);

      cumulativeVolume += volume;
      cumulativePriceVolume += typicalPrice * volume;
    }

    const vwap =
      cumulativeVolume > 0 ? cumulativePriceVolume / cumulativeVolume : 0;

    vwapData.push({
      timestamp: Number(data[i][0]),
      value: vwap,
    });
  }

  return vwapData;
}

export function calculateCustomVWAP(
  data: BybitKline[],
  period: number = 100
): VWAPData[] {
  if (data.length === 0) return [];

  const vwapData: VWAPData[] = [];

  // 각 캔들마다 해당 시점의 VWAP 계산
  for (let i = 0; i < data.length; i++) {
    if (i < period) continue;
    // 현재 캔들을 기준으로 이전 period개의 캔들 또는 처음부터 현재까지의 캔들 선택
    const startIdx = Math.max(0, i - period + 1);
    const periodData = data.slice(startIdx, i + 1);

    let cumulativeVolume = 0;
    let cumulativePriceVolume = 0;

    // 선택된 기간 내 캔들로 VWAP 계산
    for (let j = 0; j < periodData.length; j++) {
      const currentData = periodData[j];
      const typicalPrice = Number(currentData[4]);
      // 원래 공식: (고가 + 저가 + 종가) / 3
      // const typicalPrice = (Number(currentData[2]) + Number(currentData[3]) + Number(currentData[4])) / 3;
      const volume = Number(currentData[5]);

      cumulativeVolume = cumulativeVolume * 0.995 + volume;
      cumulativePriceVolume =
        cumulativePriceVolume * 0.995 + typicalPrice * volume;
    }

    const vwap =
      cumulativeVolume > 0 ? cumulativePriceVolume / cumulativeVolume : 0;

    vwapData.push({
      timestamp: Number(data[i][0]),
      value: vwap,
    });
  }

  return vwapData;
}

export function calculateVWAPMA(
  vwapData: VWAPData[],
  period: number = 20
): VWAPData[] {
  if (vwapData.length === 0) return [];

  const vwapMAData: VWAPData[] = [];

  for (let i = 0; i < vwapData.length; i++) {
    if (i < period - 1) continue;

    // Calculate the sum of VWAP values for the period
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += vwapData[j].value;
    }

    // Calculate the average
    const average = sum / period;

    vwapMAData.push({
      timestamp: vwapData[i].timestamp,
      value: average,
    });
  }

  return vwapMAData;
}
