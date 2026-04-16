let data = [];

export default function handler(req, res) {

  if (req.method === "POST") {

    const { event, asin, timestamp } = req.body;

    data.push({
      event,
      asin,
      timestamp
    });

    return res.status(200).json({ success: true });
  }

  return res.status(200).json({ success: true, data });
}
