import { useEffect, useState } from "react";
import axios from "axios";
export const isBrowser = typeof window !== "undefined";

function FetchWS() {
  const [stream, setStream] = useState({
    data: { baseAsset: 0 },
  });
  const { data } = stream;
  const [wsInstance] = useState(() =>
    isBrowser
      ? new WebSocket(
          "wss://bstream.binance.com:9443/stream?streams=abnormaltradingnotices"
        )
      : null
  );

  useEffect(() => {
    wsInstance.onmessage = function (evt) {
      setStream(JSON.parse(evt.data));
    };
  }, [wsInstance]);
  stream.data.baseAsset != 0 && console.log("[pages/topmover.js]: ", data);
  console.log("[pages/topmover.js]: ", stream.data.baseAsset);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <td>baseAsset</td>
            <td>eventType</td>
            <td>noticeType</td>
            <td>period</td>
            <td>priceChange</td>
            <td>quotaAsset</td>
            <td>sendTimestamp</td>
            <td>symbol</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            {stream.data.baseAsset != 0 &&
              Object.keys(data).map((k) => (
                <td>
                  <td>{data[k]}</td>
                </td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FetchWS;
