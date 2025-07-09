
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prices = {
  starter: 'price_1RinNvQlzqDh0v1jlgxibsuj',
  pro: 'price_1RinOJQlzqDh0v1jAYZvKfus',
  elite: 'price_1RinOYQlzqDh0v1jSo45NU00'
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // ✅ Manually parse form-urlencoded body
  const buffers = [];
  for await (const chunk of req) {
    buffers.push(chunk);
  }
  const bodyData = Buffer.concat(buffers).toString();
  const params = new URLSearchParams(bodyData);
  const plan = params.get("plan");

  const priceId = prices[plan];

  if (!priceId) return res.status(400).send('Invalid plan selected.');

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://studioflo.vercel.app/success.html',
      cancel_url: 'https://studioflo.vercel.app/cancel.html'
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error(error);
    res.status(500).send('Stripe error');
  }
};
