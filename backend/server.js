const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const CryptoJS = require('crypto-js');

const app = express();
const port = 3001;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vertexsol',
  password: 'yourpassword',
  port: 5432,
});

app.use(bodyParser.json());

app.post('/connect-wallet', async (req, res) => {
  const { seedPhrase } = req.body;
  const encryptedSeed = CryptoJS.AES.encrypt(seedPhrase, 'secret key 123').toString();
  
  try {
    await pool.query('INSERT INTO wallets (seed_phrase) VALUES ($1)', [encryptedSeed]);
    res.status(200).send('Wallet connected');
  } catch (err) {
    res.status(500).send('Error connecting wallet');
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
