'use strict';
const AWS = require('aws-sdk');
const debug = require('debug')('bb2sns:handler');

const BITBUCKET2SNS_TOPIC = 'bitbucket-sns';

const checkToken = (token, returnValue) => {
  const { BITBUCKET2SNS_TOKEN } = process.env;

  // NOTE: If env variable is not defined, no check
  const envSet = BITBUCKET2SNS_TOKEN && BITBUCKET2SNS_TOKEN !== 'undefined';
  if (!envSet || (token && token === BITBUCKET2SNS_TOKEN)) {
    return Promise.resolve(returnValue);
  }
  return Promise.reject(new Error('Invalid token: ' + token));
};

const getTopicByName = (name) => {
  const sns = new AWS.SNS();

  return sns.createTopic({
    Name: name,
  })
  .promise()
  .then(data => {
    return data.TopicArn;
  });
};

const publish = (topicName, msg) => {
  const sns = new AWS.SNS();
  const params = {
    Message: JSON.stringify({
      default: 'read target specific field instead',
      lambda: JSON.stringify(msg)
    }),
    MessageStructure: 'json',
    TopicArn: null
  };

  return getTopicByName(topicName)
  .then((topicArn) => {
    params.TopicArn = topicArn;
    return sns.publish(params).promise();
  });
};

const getBody = event => {
  return new Promise((resolve, reject) => {
    try {
      if (!event.body) {
        reject(new Error('Empty body'));
      }
      resolve(JSON.parse(event.body));
    }
    catch (err) {
      reject(err);
    }
  });
}

const handler = (event, context, cb) => {
  debug('Received an event: %o', event);

  const { token } = event.queryStringParameters;
  let body;

  if (!token) {
    return cb(new Error('Permission denied'));
  }

  Promise.all([
    checkToken(token),
    getBody(event),
  ])
  .then(res => {
    return publish(BITBUCKET2SNS_TOPIC, res[1])
  })
  .then((result) => {
    cb(null, result);
  })
  .catch((err) => {
    cb(err);
  });
};

module.exports = {
  handler,
  checkToken,
  publish,
};
