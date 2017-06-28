const AWS = require('aws-sdk-mock');
const handler = require('./handler');
const event = require('./event.json');


beforeEach(() => {
  process.env.BITBUCKET2SNS_TOKEN = 'test';
  AWS.mock('SNS', 'publish', 'test');
  AWS.mock('SNS', 'createTopic', (params, cb) => {
    cb(null, { TopicArn: 'arn:test' });
  });
});

afterEach(() => {
  process.env.BITBUCKET2SNS_TOKEN = undefined;
  AWS.restore();
});

test('publish', () => {
  return handler.publish('topic', { foo: 'bar' });
});

test('checkToken', () => {
  process.env.BITBUCKET2SNS_TOKEN = 'foo';

  return handler.checkToken('foo', true)
  .then(res => {
    expect(res).toBe(true);
    process.env.BITBUCKET2SNS_TOKEN = undefined;
    return handler.checkToken('foo', true);
  })
  .then(res => {
    expect(res).toBe(true);
  });
});

test('event', (done) => {
  handler.handler(event, {}, (err, resp) => {
    if (err) {
      throw err;
    }
    done();
  });
});
