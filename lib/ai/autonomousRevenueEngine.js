export async function autonomousRevenueEngine(data) {
  const revenue =
    (data.clicks || 0) * 0.5 +
    (data.orders || 0) * 12;

  const projection = revenue * 1.3;

  return {
    revenue,
    projection,
    status: projection > 1000 ? "SCALING" : "GROWING",
  };
}
