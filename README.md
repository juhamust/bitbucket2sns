# Bitbucket2SNS

Transforms Bitbucket webhook into AWS SNS -notifications, making it possible
to trigger for example lambda function on every commit. Bitbucket2SNS itself is
implemented as Serverless powered lambda, making it cost effective to host.

### Install Node and Serverless

Install recent Node (v4.3 preferred) and Serverless packages.
Usage of `nvm` is encouraged.

```
nvm use v4
npm install -g serverless@0.5.5
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

TBD


## License

Registerd under liberal MIT license.
