import { Consumer } from 'sqs-consumer';
import { sqsClient } from '..';

// TODO: abstract this to receive queue url and sql client as argument

export class JobNotificationQueueConsumer {
  jobNotificationConsumer() {
    return Consumer.create({
      queueUrl:
        'https://sqs.us-east-1.amazonaws.com/430118838661/JobNotificationQueue',
      sqs: sqsClient,
      handleMessage: async (message) => {
        console.log('MESSAGE FROM QUEUE:', message);
        // Add your message handling logic here i.e firebase notification
      },
    });
  }

  // Method to start the job notification queue and handle errors
  startJobNotificationQueue() {
    const consumer = this.jobNotificationConsumer();

    // Handle any processing errors
    consumer.on('processing_error', (err) => {
      console.log('Processing error:', err);
    });

    consumer.on('error', (err) => {
      console.log('Consumer error:', err);
    });

    // Start the consumer to listen for messages
    consumer.start();
  }
}
