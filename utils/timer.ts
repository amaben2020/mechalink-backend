// Singleton Timer Implementation
export class Timer {
  private static instance: Timer;
  private timeLeft: number;
  private timerInterval: NodeJS.Timeout | null;

  private constructor() {
    this.timeLeft = 0;
    this.timerInterval = null;
  }

  /**
   * Returns the singleton instance of the Timer.
   */
  public static getInstance(): Timer {
    if (!Timer.instance) {
      Timer.instance = new Timer();
    }
    return Timer.instance;
  }

  /**
   * Starts the timer for a specified duration in minutes.
   * @param durationInMinutes - The duration of the timer in minutes (default is 10).
   */
  public start(durationInMinutes: number = 10): void {
    if (this.timerInterval) {
      console.log('Timer is already running!');
      return;
    }

    this.timeLeft = durationInMinutes * 60; // Convert minutes to seconds

    this.timerInterval = setInterval(() => {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;

      console.log(`Time Left: ${minutes}m ${seconds}s`);

      if (this.timeLeft <= 0) {
        this.stop(); // Stops the timer when time runs out
        console.log('Timer finished!');
      }

      this.timeLeft--;
    }, 1000); // Run every second
  }

  /**
   * Stops the timer if it is running.
   */
  public stop(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      console.log('Timer stopped!');
    } else {
      console.log('No timer is running.');
    }
  }

  /**
   * Gets the remaining time on the timer in a formatted string.
   * @returns The time left in "mm:ss" format.
   */
  public getTimeLeft(): string {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    return `Time Left: ${minutes}m ${seconds}s`;
  }
}

// Usage example
// const timer = Timer.getInstance();
// timer.start(10);

// Somewhere else in the app
const sameTimer = Timer.getInstance();
