const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const productsRoutes = require('./routes/products.js'); // ⬅️ This loads your product routes
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const categoriesRouter = require('./routes/categories');
const cartRouter = require('./routes/cart');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes); // ⬅️ This enables /api/products
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));
