const express = require('express');
const app = express();
require('dotenv').config();

app.get('/api/home', (req, res) => {
  res.json({
    status: 200,
    message: 'hello world',
  });
});

app.listen(`${process.env.PORT} || 5000`, () => {
  console.log(
    `server is running fine ${process.env.POSTGRES_URL} ===> ${process.env.PORT}`
  );
});
