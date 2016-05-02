![logo](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/logo.png)

Bitbucket2SNS transforms Bitbucket webhook requests into AWS SNS -notifications, making it possible to trigger for example lambda function on every commit. Bitbucket2SNS itself is implemented as Serverless powered lambda, making it cost effective to host.

### Install Node and Serverless

Install recent Node (v4.3 preferred) and Serverless packages. Usage of `nvm` is encouraged.

```
nvm use v4
npm install -g serverless@0.5.5
sls --version
```

### Deploy Bitbucket2SNS lambda

```
git clone https://github.com/juhamust/bitbucket2sns.git
cd bitbucket2sns/
npm install
sls project init
sls -s dev function deploy -a
sls -s dev endpoint deploy -a
```

### Configure Bitbucket repository

1. See AWS API Gateway and collect webhook endpoint URL
  <div style="border: 1px solid #444;">![API Gateway settings](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-aws-api-gateway.png)</div>
1. Add webhook in Bitbucket repository: Settings > Integrations > Webhooks and paste collect URL in dialog
  <div style="border: 1px solid #444;">![Bitbucket settings](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-bitbucket-webhook.png)</div>
1. Done! Bitbucket webhook requests can be reviewed after sending - in a case there are some issues to solve.

### Define lambda for SNS message (optional)

Once you have Bitbucket - SNS properly configured, you can start using it. Following snippet shows how to trigger a lambda on notification.

Event sources:


<div style="border: 1px solid #444;">![Lambda event source](https://raw.githubusercontent.com/juhamust/bitbucket2sns/master/assets/config-aws-lambda-sources.png)</div>

Code:

```javascript
'use strict';
console.log('Loading function');

exports.handler = (event, context, callback) => {
    const message = event.Records[0].Sns.Message;
    console.log('From SNS:', message);
    callback(null, message);
};
```

## License

Registered under liberal MIT license.
