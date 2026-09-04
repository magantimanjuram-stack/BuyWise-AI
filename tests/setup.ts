import { beforeAll } from 'vitest';

beforeAll(() => {
  process.env.RAZORPAY_KEY_ID = 'rzp_test_buywise_demo_key';
  process.env.RAZORPAY_KEY_SECRET = 'secret_buywise_demo_key_12345';
});
