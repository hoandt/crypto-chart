import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
export const isBrowser = typeof window !== "undefined";
import axios from "axios";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function LiveChart() {
  //get symbol from route
  const router = useRouter();
  const { symbol } = router.query;

  //set series for chart

  //set options for chart
  const [options, setOptions] = useState({
    options: {
      chart: {
        id: "basic-bar",
        type: "line",
        animations: {
          enabled: false,
        },
      },

      stroke: {
        show: true,
        lineCap: "butt",
        width: 1,
        dashArray: 0,
      },
      noData: {
        text: "Loading...",
      },
      colors: ["#0000FF", "#FF0000", "#30CBC8", "#CC5A00"],
      xaxis: {
        show: false,
        labels: {
          show: false,
        },
        categories: [...Array(1016).keys()],
        tickPlacement: "on",
      },
      yaxis: {
        show: false,
      },
    },
    series: [],
  });
  // fetch data to update chart's series
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          "https://vnconsumer.com/hoan/crypto/api/signals.php?symbol=" +
            symbol.toUpperCase()
        );
        const { chartData } = response.data;

        console.log("[pages/live-chart/[symbol].js]: ", chartData);
        setOptions((prev) => {
          return {
            ...prev,
            series: chartData,
          };
        });
        //   setPostStatus(response.data);
      } catch (error) {
        console.log("[pages/ws.js]: ", error);
      }
    };

    if (symbol !== undefined) getData();
  }, [symbol]);

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <ReactApexChart options={options.options} series={options.series} />
        </div>
      </div>
    </div>
  );
}

export default LiveChart;
