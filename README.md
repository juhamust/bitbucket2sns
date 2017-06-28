# Bitbucket2SNS

Bitbucket2SNS transforms Bitbucket webhook requests into [AWS SNS](https://aws.amazon.com/sns/) -notifications, making it easy to integrate with other AWS services, for example run [Lambda function](https://aws.amazon.com/lambda/) on every commit.

![Sequence](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/bitbucket2sns.png)

[![Build Status](https://travis-ci.org/juhamust/bitbucket2sns.svg?branch=master)](https://travis-ci.org/juhamust/bitbucket2sns)

### Deploy to AWS

Install recent Node (v6.10 preferred) and Serverless packages. Usage of `nvm` is encouraged.

```bash
# Install Node and Serverless
nvm use v6.10
npm install -g serverless@1.12
sls --version

# Clone and init codebase
git clone https://github.com/juhamust/bitbucket2sns.git
cd bitbucket2sns/
npm install

# Edit settings if needed
vim env.yml

# Deploy
sls deploy --profile=my-aws-profile

# Output (copy endpoint address)
> Service Information
> service: bitbucket2sns
> stage: dev
> region: eu-central-1
> api keys:
>   None
> endpoints:
>   POST - https://123123.execute-api.eu-central-1.amazonaws.com/dev/webhook
> functions:
>   webhook: bitbucket2sns-dev-webhook
```

### Configure Bitbucket repository

1. Open Bitbucket repository (that you want to send webhook requests to AWS) settings
1. Open webhook -section in Bitbucket repository: Settings > Integrations > Webhooks
1. Click **Add webhook** and paste the collected URL **and** set the authentication token as `?token=<tokenvalue>` (usage of token is optional but recommended). Example: `https://123123.execute-api.eu-west-1.amazonaws.com/dev/webhook?token=secret`
1. You can test the functionality by committing a new change set. Bitbucket webhook requests can be reviewed after sending in **View requests**.

  ![Bitbucket settings](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-bitbucket-webhook.png)

1. You can see the Lambda logs in [AWS CloudWatch](https://aws.amazon.com/cloudwatch/)

### Define lambda for SNS message (optional)

Once you've setup Bitbucket - SNS properly configured, you can start using it. Following snippet shows how to trigger a lambda on notification.

1. Go to Lambda -service
1. Start new Lambda with **Create a Lambda function**
1. Type in the code (see example)
1. Use `bitbucket-sns` as event source
1. See Monitoring section for lambda logs

```javascript
'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
  const message = event.Records[0].Sns.Message;
  console.log('From SNS:', message);
  callback(null, message);
};
```
![Lambda event source](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-aws-lambda-sources.png)

## Changelog

#### 0.2.0

- Support for Serverless 1.x
- Added unit testing

#### 0.1.0

- Initial release

## License

MIT -licensed
