import { app } from './app.js';

let server;

server = app.listen(process.env.PORT, () => {
  console.log(
    process.env.NODE_ENV == 'development'
      ? process.env.DATABASE_URL_DEV
      : process.env.DATABASE_URL_PROD
  );
  console.log('Running now...');
});

const exitHandler = () => {
  if (server) {
    console.log('Server closed');
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unhandledExceptionErrorHandler = (error: any) => {
  console.error(error);
  exitHandler();
};

process.on('uncaughtException', unhandledExceptionErrorHandler);
process.on('unhandledRejection', unhandledExceptionErrorHandler);

process.on('SIGTERM', () => {
  if (server) {
    console.log('Server closed');
    process.exit(1);
  }
});
