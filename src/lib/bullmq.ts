import { Queue, Worker, Job, QueueOptions, WorkerOptions } from 'bullmq';
import IORedis from 'ioredis';

const redis = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
});

export class QueueBuilder<T, P extends T = T> {
  private queue: Queue<P>;
  private worker: Worker<P>;
  private isRunning: boolean = false;

  constructor(
    private name: string,
    private processJob: (job: Job<P>) => Promise<void>,
    private options: QueueOptions & WorkerOptions = { connection: redis }
  ) {
    this.queue = new Queue<P>(name, options);
    this.worker = new Worker<P>(name, processJob, options);

    this.worker.on('completed', (job) => {
      console.log(`Job ${job.id} has completed`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} has failed with ${err.message}`);
    });
  }

  async addJob(jobData: P): Promise<Job<P>> {
    return this.queue.add(this.name, jobData);
  }

  async run(): Promise<void> {
    if (this.isRunning) {
      console.log(`Worker for queue ${this.name} is already running`);
      return;
    }
    await this.worker.run();
    this.isRunning = true;
    console.log(`Worker for queue ${this.name} is running with concurrency ${this.options.concurrency || 1}`);
  }

  getQueue(): Queue<P> {
    return this.queue;
  }

  getWorker(): Worker<P> {
    return this.worker;
  }
}

export { redis };