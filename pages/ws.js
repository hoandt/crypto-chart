import axios from "axios";
import { useEffect, useState } from "react";
function WSPage() {
  const [postStatus, setPostStatus] = useState({ success: false });
  useEffect(() => {
    const kline = { id: 1, amt: 2000 };
    const getData = async () => {
      try {
        const response = await axios.post(
          "https://vnconsumer.com/hoan/crypto/api/post.php",
          kline
        );
        setPostStatus(response.data);
      } catch (error) {
        console.log("[pages/ws.js]: ", error);
      }
    };

    getData();
  }, []);

  return <div>{postStatus.success ? "ok" : "..."}</div>;
}

export default WSPage;
