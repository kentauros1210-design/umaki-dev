const express = require
('express');
const app = express();
const port = 5964;

app.get('/', (req, res) => {
  res.send('Hello, wanwan!');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
