'use strict';
const AWS = require('aws-sdk');

var sns = new AWS.SNS({
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
});

const checkToken = (token, returnValue) => {
  console.log('Envs', process.env.BITBUCKET2SNS_TOKEN, token);
  // NOTE: If env variable is not defined, no check
  if (token === process.env.BITBUCKET2SNS_TOKEN) {
    return Promise.resolve(returnValue);
  }
  return Promise.reject('Invalid token');
};

const getTopicByName = (name) => {
  const params = {
    Name: name
  };
  return new Promise((resolve, reject) => {
    sns.createTopic(params, function(err, data) {
      if (err) return reject(err);
      return resolve(data.TopicArn);
    });
  });
};

const publish = (topicName, msg) => {
  var params = {
    Message: JSON.stringify({
      default: 'read target specific field instead',
      lambda: JSON.stringify(msg)
    }),
    MessageStructure: 'json',
    TopicArn: null
  };

  return getTopicByName(topicName)
  .then((topicArn) => {
    return new Promise((resolve, reject) => {
      params.TopicArn = topicArn;
      console.log('Publish to SNS:', topicName, topicArn);
      sns.publish(params, function(err, data) {
        if (err) {
          console.error('Failed to publish SNS notification:', err, err.stack);
          return reject(err);
        }
        return resolve('Successfully notified')
      });
    });
  });
};

module.exports.handler = (event, context) => {
  console.log('Event', event);
  if (!event.webhook || !event.token) {
    return context.fail('Missing require data: webhook/token');
  }

  checkToken(event.token)
  .then(() => {
    return publish('bitbucket-sns', event.webhook)
  })
  .then((result) => {
    return context.succeed(result);
  })
  .catch((err) => {
    return context.fail(err);
  });
};
