export default async function handler(req, res) {
  return res.status(200).json({
    reply: "API is working ✅ WhatsApp assistant connected successfully"
  });
}