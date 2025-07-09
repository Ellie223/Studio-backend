const express = require('express');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const bodyParser = require('body-parser');

// Middleware
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Stripe Price IDs
const prices = {
  starter: 'price_1RinNvQlzqDh0v1jlgxibsuj',
  pro: 'price_1RinOJQlzqDh0v1jAYZvKfus',
  elite: 'price_1RinOYQlzqDh0v1jSo45NU00'
};

// Checkout session route
app.post('/create-checkout-session', async (req, res) => {
  const plan = req.body.plan;
  const priceId = prices[plan];

  if (!priceId) return res.status(400).send('Invalid plan selected.');

  // ✅ Log the request for debugging
  console.log("Creating session for plan:", plan, "with priceId:", priceId);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://studioflo.vercel.app/success.html',
      cancel_url: 'https://studioflo.vercel.app/cancel.html'
    });

    res.redirect(303, session.url);
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Port setup (for Railway compatibility)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

