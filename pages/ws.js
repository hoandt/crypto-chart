import { useEffect, useState } from "react";
import api from "./axios/api";

function WSPage() {
  const [postStatus, setPostStatus] = useState({ success: false });
  useEffect(() => {
    const kline = { id: 1, amt: 2000 };
    const getData = async () => {
      try {
        const response = await api.post("/post.php", kline);
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
