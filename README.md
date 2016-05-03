![logo](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/logo.png)

Bitbucket2SNS transforms Bitbucket webhook requests into AWS SNS -notifications, making it possible to trigger for example lambda function on every commit. Bitbucket2SNS itself is implemented as Serverless powered lambda, making it cost effective to host.

### Install Node and Serverless

Install recent Node (v4.3 preferred) and Serverless packages. Usage of `nvm` is encouraged.

```bash
nvm use v4
npm install -g serverless@0.5.5
sls --version
```

### Deploy Bitbucket2SNS lambda

```bash
# Clone and init codebase
git clone https://github.com/juhamust/bitbucket2sns.git
cd bitbucket2sns/
npm install
# Define the AWS project env
sls project init
> Serverless: Enter a new stage name for this project:
>   Existing Profile
>   Create A New Profile
# Configure token that is used for authentication
sls -s dev variables set
> Serverless: Enter variable key to set a value to: bitbucket2Sns
> Serverless: Enter variable value to set a value to:  secret
# Deploy code
sls -s dev function deploy -a
sls -s dev endpoint deploy -a
```

### Configure AWS

This section assumes you already have an AWS account. Also, the actual configuration changes are done by Serverless, so only checking the outcome is needed

1. Go to API Gateway -service
1. Select the API in question
1. Expand the stages and see webhook endpoint URL

  ![API Gateway settings](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-aws-api-gateway.png)

## Configure Bitbucket repository

1. Open Bitbucket repository (that you want to send webhook requests to AWS) settings
1. Open webhook -section in Bitbucket repository: Settings > Integrations > Webhooks
1. Click **Add webhook** and paste collect URL in dialog **and** set the authentication token as `?token=<tokenvalue>`. Example: `https://123123.execute-api.eu-west-1.amazonaws.com/dev/webhook?token=secret`
1. Done! You can test the functionality by committing a new change set. Bitbucket webhook requests can be reviewed after sending in **View requests**.

  ![Bitbucket settings](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-bitbucket-webhook.png)

### Define lambda for SNS message (optional)

Once you have Bitbucket - SNS properly configured, you can start using it. Following snippet shows how to trigger a lambda on notification.

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

## License

Registered under liberal MIT license.
