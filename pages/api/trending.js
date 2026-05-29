export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/system?action=trending`
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message,
    });
  }
}
