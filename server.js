require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Use environment variable for the secret key
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('GET / request received');
    res.send('Hello, your server is running!');
});

app.post('/create-payment-intent', async (req, res) => {
    console.log('POST /create-payment-intent request received');
    console.log('Request body:', req.body);
    console.log('Stripe secret key:', process.env.STRIPE_SECRET_KEY); // Log the secret key for debugging
    const { amount, currency, organizationId } = req.body;
    
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to cents
            currency: currency,
            metadata: { organizationId: organizationId },
        });
        console.log('Payment Intent created:', paymentIntent);

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
