import { useEffect, useState } from "react";

export const isBrowser = typeof window !== "undefined";

function FetchWS() {
  const [stream, setStream] = useState({});
  //   const { e, E, s, t, p, q, b, a, T, m, M } = stream;
  const [wsInstance] = useState(() =>
    isBrowser
      ? new WebSocket("wss://stream.binance.com:9443/ws/egldusdt@kline_1m")
      : null
  );

  useEffect(() => {
    wsInstance.onmessage = function (evt) {
      setStream(JSON.parse(evt.data));
      //   console.log("[pages/ws.js]: ", Object.keys(JSON.parse(evt.data)));
    };
  }, []);

  return <div>{`${JSON.stringify(stream)}`}</div>;
}

export default FetchWS;
