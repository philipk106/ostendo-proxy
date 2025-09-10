const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OSTENDO_API_KEY = process.env.OSTENDO_API_KEY;

app.use(express.text()); // To accept text/plain POST bodies

app.post('/proxy-sql', async (req, res) => {
  if (!OSTENDO_API_KEY) {
    return res.status(500).send('OSTENDO_API_KEY environment variable not set');
  }

  const sqlQuery = req.body;
  if (!sqlQuery) {
    return res.status(400).send('No SQL query provided in request body');
  }

  const url = `https://freeway.krhyd.com.au:443/sqlquery/?apikey=${OSTENDO_API_KEY}&format=json&configuration=1`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)'
      },
      body: sqlQuery
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.json(data);

  } catch (error) {
    res.status(500).send(error.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Ostendo proxy listening on port ${PORT}`);
});
