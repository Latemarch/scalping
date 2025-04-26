"use client";
import * as React from "react";
import { getRecentCandles } from "@/lib/getCandles";
import { BybitKline } from "@/types/type";
import ChartLayout from "./ChartLayout";

export default function Container() {
  const [candleData, setCandleData] = React.useState<BybitKline[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const res = await getRecentCandles({});
      if (res.ok)
        setCandleData(
          // res.data?.map((d) => [d[0], d[1], d[2], d[3], d[4], Max(Math.log(d[5]))])
          res.data
        );
    };
    fetchData();
  }, []);

  return (
    <div>{candleData.length && <ChartLayout candleData={candleData} />}</div>
  );
}
