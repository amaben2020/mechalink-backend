const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const sqsClient = require('..');

require('dotenv').config();

class JobNofificationQueue {
  async sendMessageToQueue(message) {
    try {
      const command = new SendMessageCommand({
        MessageBody: message,
        QueueUrl: process.env.AWS_QUEUE_URL,
        MessageAttributes: {
          OrderId: { DataType: 'String', StringValue: '4421x' },
        },
      });
      console.log(command);
      const result = await sqsClient.send(command);
      console.log(result);
      // once done processing, delete the message from the queue
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = JobNofificationQueue;
