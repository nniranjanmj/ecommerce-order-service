const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let orders = [];
let orderIdCounter = 1;

app.post('/', async (req, res) => {
  const { userId, items } = req.body;
  
  // Calculate total
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  
  const order = {
    id: orderIdCounter++,
    userId,
    items,
    total,
    status: 'pending',
    createdAt: new Date()
  };
  
  orders.push(order);
  res.status(201).json(order);
});

app.get('/user/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === parseInt(req.params.userId));
  res.json(userOrders);
});

app.get('/:id', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.put('/:id/status', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  order.status = req.body.status;
  res.json(order);
});

app.listen(3003, () => console.log('Order Service running on port 3003'));