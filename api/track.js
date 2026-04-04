export default function handler(req, res) {
  if (req.method === 'POST') {
    // هنا تحطي أي logic للـ tracking
    // مثال: سجل البيانات في DB أو Firebase
    console.log("Tracking data:", req.body);

    res.status(200).json({ status: 'tracking success' });
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
