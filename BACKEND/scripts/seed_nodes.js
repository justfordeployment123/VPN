const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Node = require('../models/Node');
const path = require('path');


dotenv.config({ path: path.join(__dirname, '../.env') });

const nodes = [
  {
    name: "NY-01",
    countryCode: "US",
    city: "New York",
    ipAddress: "157.230.93.112",
    publicKey: "L0zI5YMjdtd6E02hBCAQivz0Q+VjdZUE2Hy2bR1/EnM=",
    port: 51820,
    allowedTiers: ['free', 'premium']
  },
  {
    name: "SF-01",
    countryCode: "US",
    city: "San Francisco",
    ipAddress: "167.71.199.96",
    publicKey: "poBJybV3cwBK5ZWeb8Xke2odEoiczw1JGdwmMvZRamk=",
    port: 51820,
    allowedTiers: ['free', 'premium']
  }
];

const seedNodes = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error(`MONGODB_URI is not defined. Env path searched: ${path.join(__dirname, '../.env')}`);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');

    
    await Node.deleteMany();

    
    await Node.insertMany(nodes);
    console.log('Nodes Seeded Successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedNodes();
