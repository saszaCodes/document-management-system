import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('This is my first Express server');
});

export default app;
