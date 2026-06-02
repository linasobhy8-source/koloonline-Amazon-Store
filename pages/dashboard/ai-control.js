import { useEffect, useState } from "react";

export default function AIControl() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const res = await fetch("/api/ai/run-engine");

        if (!res.ok) {
          throw new Error("Failed to load AI engine data");
        }

        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      
      <h1>🧠 AI Control Panel</h1>

      {/* ================= DESCRIPTION (ADS SAFE) ================= */}
      <p style={{ color: "#555", maxWidth: 700 }}>
        This dashboard displays system-generated analytics and backend execution
        results for monitoring and debugging purposes. It helps track API
        responses and system behavior in real time.
      </p>

      {/* ================= STATES ================= */}
      {loading && <p>Loading system data...</p>}

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {/* ================= DATA ================= */}
      {!loading && !error && (
        <pre
          style={{
            background: "#111",
            color: "#0f0",
            padding: 15,
            borderRadius: 10,
            overflowX: "auto",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
