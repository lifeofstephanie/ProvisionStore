const express = require('express');
const app = express();
app.use(express.json());

const products = [];

function generateId() {
  return Math.floor(Math.random() * 1000000);
}

const validStatuses = ['in-stock', 'low-stock', 'out-of-stock'];

app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/products', (req, res) => {
  const { productName, cost, stockStatus } = req.body;

  if (!validStatuses.includes(stockStatus)) {
    return res.status(400).json({ message: 'Invalid stock status' });
  }

  const newProduct = {
    id: generateId(),
    productName,
    cost,
    stockStatus,
    createdAt: new Date()
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
  const product = products.find(p => p.id == req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const { productName, cost } = req.body;

  if (productName !== undefined) product.productName = productName;
  if (cost !== undefined) product.cost = cost;

  res.json(product);
});

app.patch('/products/:id/:status', (req, res) => {
  const { id, status } = req.params;
  const product = products.find(p => p.id == id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid stock status' });
  }

  product.stockStatus = status;
  res.json(product);
});

app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(index, 1);
  res.json({ message: 'Product deleted' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
