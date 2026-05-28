export default async function handler(req, res) {
  return res.status(200).json({
    success: false,
    disabled: true,
    message: "generate-blog is temporarily disabled",
  });
}
