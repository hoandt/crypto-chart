import { useEffect, useState } from "react";

export const isBrowser = typeof window !== "undefined";

function FetchWS() {
  const [stream, setStream] = useState({ k: { c: "..." } });
  const {
    k: { c: close_price },
  } = stream;
  const [wsInstance] = useState(() =>
    isBrowser
      ? new WebSocket("wss://stream.binance.com:9443/ws/egldusdt@kline_1m")
      : null
  );

  useEffect(() => {
    wsInstance.onmessage = function (evt) {
      setStream(JSON.parse(evt.data));
    };
  }, []);
  console.log("[pages/ws.js]: ", stream.k);
  return (
    <div>
      <h1>{close_price}</h1>
    </div>
  );
}

export default FetchWS;
