"use client";

import { Switch } from "@heroui/react";
import * as React from "react";
import { useChartStore } from "@/store/chartStore";
export default function OptionPanel() {
  const chartOptions = useChartStore((state) => state.chartOptions);
  const toggleIndicator = useChartStore((state) => state.toggleIndicator);

  return (
    <div className="flex flex-col items-start gap-2 border rounded-lg p-4 shadow-lg text-white">
      <h3 className="text-lg font-semibold">차트 지표 설정</h3>
      <div className="flex gap-4">
        {/* <Switch
        defaultSelected={chartOptions.macd}
        aria-label="MACD"
        onValueChange={() => toggleIndicator('macd')}
      >
        MACD
      </Switch> */}
        <Switch
          defaultSelected={chartOptions.ma5}
          aria-label="MA50"
          onValueChange={() => toggleIndicator("ma5")}
        />
        ma50
        <Switch
          defaultSelected={chartOptions.ma10}
          aria-label="MA100"
          onValueChange={() => toggleIndicator("ma10")}
        />
        ma100
        <Switch
          defaultSelected={chartOptions.ma20}
          aria-label="MA200"
          onValueChange={() => toggleIndicator("ma20")}
        />
        ma200
        <Switch
          defaultSelected={chartOptions.bollingerBands}
          aria-label="Bollinger Bands"
          onValueChange={() => toggleIndicator("bollingerBands")}
        />
        bollingerBands
        <Switch
          defaultSelected={chartOptions.vwap}
          aria-label="VWAP"
          onValueChange={() => toggleIndicator("vwap")}
        />
        vwap
      </div>
    </div>
  );
}
