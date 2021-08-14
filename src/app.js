import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('This is my first Express server');
});

app.listen(process.env.port || 3000);
