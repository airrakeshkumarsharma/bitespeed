import dotenv from "dotenv";

dotenv.config({
  path: `.env` // development env by default
});

console.info(`USING ENVIRONMENT: ${process.env.NODE_ENV}`);
