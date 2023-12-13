import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  SECRET: process.env.SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
};

export default config;
