import { QueueBuilder } from '../../lib/bullmq';
import { updateUserFeed } from './feed.service';
import { FeedJobData } from './feed.schema';
import { fetchPost } from '../post/post.service';

export const feedQueue = new QueueBuilder<FeedJobData>(
  'feedQueue',
  async (job) => {
    console.log({job})
    const { userId, postId } = job.data;
    const post = await fetchPost(postId);
    if (post) {
      await updateUserFeed(userId, post);
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    },
    concurrency: 10, // Process 10 jobs concurrently
  }
);

export const initializeFeedQueue = async () => {
  try {
    await feedQueue.run();
  } catch (error) {
    console.error('Error initializing feed queue:', error);
  }
};

export const addFeedJob = async (jobData: FeedJobData) => {
  return feedQueue.addJob(jobData);
};