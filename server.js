const express = require('express');
const app = express();
require('dotenv').config();
const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');
const { configObject } = '/credentials.js';

// move to SQS factory
const sqsClient = new SQSClient(configObject);
const queueUrl = process.env.AWS_QUEUE_URL;

// message to be sent
const sendMessageToQueue = async (body) => {
  try {
    const command = new SendMessageCommand({
      MessageBody: body,
      QueueUrl: queueUrl,
      MessageAttributes: {
        OrderId: { DataType: 'String', StringValue: '4421x' },
      },
    });
    const result = await sqsClient.send(command);
    console.log(result);
  } catch (error) {}
};

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
