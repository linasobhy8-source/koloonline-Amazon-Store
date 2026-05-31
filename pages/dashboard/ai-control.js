import { useEffect, useState } from "react";

export default function AIControl() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/ai/run-engine")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🧠 AI CONTROL PANEL (LEVEL 20)</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
