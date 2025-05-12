"use client";
import * as React from "react";
import * as d3 from "d3";
import { BybitKline } from "@/types/type";
import {
  createBaseLine,
  createGuideLines,
  createIndicators,
} from "@/lib/D3/candlesChart";
import Update from "./Update";
import Draw from "./Draw";
import { calculateBollingerBands } from "@/lib/D3/bollingerBands";
import { calculateMACD } from "@/lib/D3/macd";
import { IndicatorData } from "@/types/type";
import { useChartStore } from "@/store/chartStore";
import { colors } from "@/lib/constants";
import BackTest from "./BackTest";
import { calculateMovingAverage } from "@/lib/D3/movingAgerage";
import { calculateVWAP } from "@/lib/D3/VWAP";
type Props = {
  initialWidth?: number;
  height?: number;
  candleData: BybitKline[];
};

export default function ChartLayout({
  initialWidth = 500,
  height = 500,
  candleData,
}: Props) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [renderComplete, setRenderComplete] = React.useState(false);
  const [indicators, setIndicators] = React.useState<IndicatorData>({});
  const chartOptions = useChartStore((state) => state.chartOptions);
  // const [chartOptions, setChartOptions] = React.useState<ChartOptions>({
  //   macd: false,
  //   ma5: false,
  //   ma10: false,
  //   ma20: false,
  //   bollingerBands: false,
  //   vwap: false,
  // });
  const candleChartHeightRatio = 0.6;
  const volumeChartHeightRatio = 0.8;

  // 지표 데이터 계산 - candleData가 변경될 때마다 실행
  React.useEffect(() => {
    if (!candleData.length) return;

    setIndicators({
      macd: chartOptions.macd ? calculateMACD(candleData) : null,
      ma5: chartOptions.ma5 ? calculateMovingAverage(candleData, 50) : null,
      ma10: chartOptions.ma10 ? calculateMovingAverage(candleData, 100) : null,
      ma20: chartOptions.ma20 ? calculateMovingAverage(candleData, 200) : null,
      bollingerBands: chartOptions.bollingerBands
        ? calculateBollingerBands(candleData, 20)
        : null,
      vwap: chartOptions.vwap ? calculateVWAP(candleData, 200) : null,
    });
  }, [candleData, chartOptions]);

  React.useEffect(() => {
    if (!svgRef.current) return;

    setRenderComplete(false);

    const svg = d3
      .select(svgRef.current)
      .attr("class", "bg-bgPrimary")
      .attr("width", initialWidth)
      .attr("height", height + 20)
      .attr("border", "1px solid steelblue");

    const width = initialWidth - 20;
    const { gray } = colors;

    createBaseLine(
      svg,
      width,
      height,
      candleChartHeightRatio,
      volumeChartHeightRatio
    );

    d3.scaleTime()
      .domain([
        new Date(Number(candleData[0][0])),
        new Date(Number(candleData[candleData.length - 1][0])),
      ])
      .range([Math.min(0, width - initialWidth), width]);

    svg
      .append("g")
      .attr("class", "y-volume-axis")
      .attr("transform", `translate(${width}, 0)`)
      .style("color", gray);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height})`)
      .style("color", gray);

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${width}, 0)`)
      .style("color", gray);

    // text on left-top
    svg
      .append("text")
      .attr("class", "candle-info")
      .attr("x", 10)
      .attr("y", 20)
      .style("font-size", "16px")
      .style("fill", gray)
      .style("text-anchor", "start");
    //

    createGuideLines(svg);
    createIndicators(svg, width, height, 1);

    setTimeout(() => setRenderComplete(true), 0);

    return () => {
      svg.selectAll("*").remove();
      setRenderComplete(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="">
      <svg ref={svgRef} />
      {renderComplete && (
        <Draw
          svgRef={svgRef}
          candleData={candleData}
          height={height}
          candleChartHeightRatio={candleChartHeightRatio}
          volumeChartHeightRatio={volumeChartHeightRatio}
          indicators={indicators}
        />
      )}
      {renderComplete && (
        <Update
          svgRef={svgRef}
          candleData={candleData}
          height={height}
          width={initialWidth}
        />
      )}
      {renderComplete && (
        <BackTest
          svgRef={svgRef}
          candleData={candleData}
          height={height}
          width={initialWidth}
        />
      )}
    </div>
  );
}
