import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();

export const app = express();

//@ts-ignore
if (process.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// helmet for security
app.use(helmet());

// parsing the incoming Request Object without body parser
app.use(express.json());

// recognizes the incoming Request Object as strings or arrays
app.use(
  express.urlencoded({
    extended: true,
  })
);

// cookie parser for cookies during auth
app.use(cookieParser());

// routes
app.use('/api/v1', router);

app.get('/api/test', (req, res) => {
  res.json({
    status: 200,
    message: 'Running...',
    port: process.env.PORT,
    isDev: process.env.NODE_ENV === 'development',
  });
});
