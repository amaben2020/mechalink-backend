// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
// import { JobNotificationQueueConsumer } from './services/sqs/consumer/jobNotification';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes/index.js';

dotenv.config();

function protectedRoute(req, res, next) {
  if (req.body.name.includes('a')) {
    next();
  } else {
    res.send(401, 'Unauthorized');
  }
}

const app = express();
if (process.NODE_ENV !== 'production') {
  // only use in development
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

// // cookie parser for cookies during auth
// app.use(cookieParser());

// routes
app.use('/api/v1', router);

app.post('/api/test', protectedRoute, (req, res) => {
  console.log(req.body);
  try {
    res.json({ message: 'All good' });
  } catch (error) {
    console.log(error);
  }
});

app.get('/api/home', (req, res) => {
  res.json({
    status: 200,
    message: 'hello world...',
  });
});

app.get('/api/away', (req, res) => {
  res.json({
    status: 200,
    message: 'Just added this',
    port: process.env.PORT,
    isDev: process.env.NODE_ENV === 'development',
  });
});
// process.NODE_ENV === 'development' ? 8080 : process.env.PORT || 5000
//process.env.PORT || 5000
console.log(process.env.NODE_ENV);
app.listen(
  // process.env.NODE_ENV.trim() === 'development'
  //   ? 8080
  //   : process.env.PORT || 5000,
  process.env.PORT || 5000,
  () => {
    console.log(
      `server is running fine ${process.env.POSTGRES_URL} ===> ${process.env.PORT}`
    );
  }
);

// use the producer in viable service..
// const sendJobNotification = new JobNofificationQueue();
// sendJobNotification.sendMessageToQueue(
//   JSON.stringify({
//     title: 'It works',
//   })
// );

// const jobNotifConsumer = new JobNotificationQueueConsumer();

// jobNotifConsumer.startJobNotificationQueue();

// Call signupUser function
// signupUser('amaben1', 'Password123!', 'mechalink3@gmail.com');

// confirmUserSignup('amaben1', '280085');

// resendConfirmationCode('amaben1');

// signinUser('amaben1', 'Password123!');

// let server;

// server = app.listen(PORT, () => {
//   logger.info('Running...');
// });

// const exitHandler = () => {
//   if (server) {
//     logger.info('Server closed');
//     process.exit(1);
//   } else {
//     process.exit(1);
//   }
// };

// // the error here is passed as an event
// const unhandledExceptionErrorHandler = (error) => {
//   logger.error(error);
//   exitHandler();
// };

// // handling error gracefully
// process.on('uncaughtException', unhandledExceptionErrorHandler);
// process.on('unhandledRejection', unhandledExceptionErrorHandler);

// // signal termination
// process.on('SIGTERM', () => {
//   if (server) {
//     logger.info('Server closed');
//     process.exit(1);
//   }
// });
