import dotenv from 'dotenv';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient } from '..';
dotenv.config();
export class JobNofificationQueue {
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
