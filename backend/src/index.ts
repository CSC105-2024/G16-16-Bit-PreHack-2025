import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import api from '../routes/index.ts';

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = new Hono();

// Set up middleware
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  
  exposeHeaders: ['Set-Cookie']
}));

app.get('/', (c) => {
  return c.json({ status: 'success', message: 'PinPoint API is running' });
});

app.route('', api);

console.log(`Server is running on port ${port}`);
serve({
  fetch: app.fetch,
  port
});