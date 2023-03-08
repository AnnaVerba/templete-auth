import { config } from 'dotenv';

config();

export const development = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
};
export const production = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
};
export const test = {
  url: process.env.DATABASE_URL,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
