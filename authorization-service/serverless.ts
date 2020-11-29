import type { Serverless } from 'serverless/aws';
import dotenv from 'dotenv';
dotenv.config();

const serverlessConfiguration: Serverless = {
  service: {
    name: 'authorization-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: [
    'serverless-webpack',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: process.env.REGION,
    profile: 'njsprogram',
    stage: process.env.STAGE,
    apiName: `import-service-${process.env.STAGE}-API`,
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      REGION: process.env.REGION,
      TEST_USER: process.env.TEST_USER,
      TEST_PASSWORD: process.env.TEST_PASSWORD,
    },
  },
  functions: {
    basicAuthorizer: {
      handler: 'handler.basicAuthorizer'
    }
  }
};

module.exports = serverlessConfiguration;
