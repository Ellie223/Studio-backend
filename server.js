const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const prices = {
  starter: 'price_0XXXstarter',
  pro: 'price_0XXXpro',
  elite: 'price_0XXXelite'
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

app.listen(4242, () => console.log('Server running on port 4242'));
