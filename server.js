const express = require('express');
const app = express();
require('dotenv').config();

const JobNotificationQueueConsumer = require('./services/sqs/consumer/jobNotification');

const JobNofificationQueue = require('./services/sqs/producer/jobNotification');

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
  });
});

//process.env.PORT || 5000
app.listen(8000, () => {
  console.log(
    `server is running fine ${process.env.POSTGRES_URL} ===> ${process.env.PORT}`
  );
});

// use the producer in viable service..
// const sendJobNotification = new JobNofificationQueue();
// sendJobNotification.sendMessageToQueue(
//   JSON.stringify({
//     title: 'It works',
//   })
// );

const jobNotifConsumer = new JobNotificationQueueConsumer();

jobNotifConsumer.startJobNotificationQueue();
