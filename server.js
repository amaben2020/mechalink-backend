const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'hi',
  });
});

app.listen(8080, () => {
  console.log('server is running fine...');
});
