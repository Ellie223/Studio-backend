const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const prices = {
  starter: 'price_1RinNvQlzqDh0v1jlgxibsuj',
  pro: 'price_1RinOJQlzqDh0v1jAYZvKfus',
  elite: 'price_1RinOYQlzqDh0v1jSo45NU00'
};

app.post('/create-checkout-session', async (req, res) => {
  const plan = req.body.plan;
  const priceId = prices[plan];

  if (!priceId) return res.status(400).send('Invalid plan selected.');

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: 'https://studioflo.vercel.app/success.html',
    cancel_url: 'https://studioflo.vercel.app/cancel.html'
  });

  res.redirect(303, session.url);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

