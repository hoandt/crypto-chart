import { useEffect, useState } from "react";
import axios from "axios";
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
  }, [wsInstance]);
  useEffect(() => {
    if (kline_closed) {
      const getData = async () => {
        try {
          const response = await axios.post(
            "https://vnconsumer.com/hoan/crypto/api/post.php",
            stream.k
          );
          setPostStatus(response.data);
        } catch (error) {
          console.log("[pages/ws.js]: ", error);
        }
      };

      getData();
    }
  }, [kline_closed, stream.k]);

  // console.log("[pages/index.js]: ", postStatus);

  return (
    <div>
      <h1>{close_price}</h1>
    </div>
  );
}

export default FetchWS;
