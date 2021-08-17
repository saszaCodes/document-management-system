import express from 'express';

const app = express();

const PORT = process.env.port || 3000;

app.get('/', (req, res) => {
  res.send('This is my first Express server');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
