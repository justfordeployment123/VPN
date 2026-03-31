const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/auth', require('./routes/auth'));
app.use('/api/nodes', require('./routes/node'));
app.use('/api/vpn', require('./routes/vpn'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));


app.use((err, req, res, next) => {
  console.error('*** STACK TRACE ***');
  console.error(err.stack);
  res.status(500).json({ msg: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
