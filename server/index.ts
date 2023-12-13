import dotenv from 'dotenv';
import express from 'express';

dotenv.config();
const app = express();

app.get('/', (req, res) => {
  res.send('Hello Thesre!');
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
