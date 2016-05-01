'use strict';
const AWS = require('aws-sdk');

var sns = new AWS.SNS({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION });

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
      default: 'default msg',
      json: msg
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

const respond = (event) => {
  //console.log('Received an event:', event);
  return publish('bitbucket-sns', event.webhook);
};

module.exports.handler = (event, context) => {
  respond(event)
  .then((result) => {
    return context.succeed(result);
  }).catch((err) => {
    return context.fail(err);
  });
};
