import { useEffect, useState } from "react";
import api from "./axios/api";

export const isBrowser = typeof window !== "undefined";

function FetchWS() {
  const [stream, setStream] = useState({ k: { c: "...", x: false } });
  const [postStatus, setPostStatus] = useState({ success: false });

  const {
    k: { c: close_price, x: kline_closed },
  } = stream;
  const [wsInstance] = useState(() =>
    isBrowser
      ? new WebSocket("wss://stream.binance.com:9443/ws/lunausdt@kline_1m")
      : null
  );

  useEffect(() => {
    wsInstance.onmessage = function (evt) {
      setStream(JSON.parse(evt.data));
    };
  }, []);
  useEffect(() => {
    if (kline_closed) {
      const getData = async () => {
        try {
          const response = await api.post("/post.php", stream.k);
          setPostStatus(response.data);
        } catch (error) {
          console.log("[pages/ws.js]: ", error);
        }
      };

      getData();
    }
  }, [kline_closed]);

  console.log("[pages/index.js]: ", postStatus);

  return (
    <div>
      <h1>{close_price}</h1>
    </div>
  );
}

export default FetchWS;
