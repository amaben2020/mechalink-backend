const express = require('express');
const app = express();
require('dotenv').config();

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'hi',
  });
});

app.listen(8080, () => {
  console.log(
    `server is running fine... ${process.env.POSTGRES_URL} ===> ${process.env.PORT}`
  );
});
