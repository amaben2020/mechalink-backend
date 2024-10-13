const { sqsClient } = require('../index');
const { Consumer } = require('sqs-consumer');

class JobNotificationQueueConsumer {
  // Define a method to create the job notification consumer
  jobNotificationConsumer() {
    return Consumer.create({
      queueUrl: process.env.AWS_QUEUE_URL,
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

    // Handle any other consumer errors (e.g., SQS errors)
    consumer.on('error', (err) => {
      console.log('Consumer error:', err);
    });

    // Start the consumer to listen for messages
    consumer.start();
  }
}

module.exports = JobNotificationQueueConsumer;
