import type { Serverless } from 'serverless/aws';
import dotenv from 'dotenv'
dotenv.config();

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
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
    apiName: `product-service-${process.env.STAGE}-API`,
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST: process.env.DB_HOST,
      DB_PORT: process.env.DB_PORT,
      DB_NAME: process.env.DB_NAME,
      DB_USERNAME: process.env.DB_USERNAME,
      DB_PASSWORD: process.env.DB_PASSWORD,
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::GetAtt': ['CatalogBatchQueue', 'Arn'],
        },
      },
    ],
  },
  resources: {
    Resources: {
      CatalogBatchQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: `${process.env.SQS_QUEUE_NAME}-${process.env.STAGE}`,
        }
      },
    },
  },
  functions: {
    getProductsList: {
      handler: 'handler.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    getProductsById: {
      handler: 'handler.getProductsById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            cors: true
          }
        }
      ]
    },
    addProduct: {
      handler: 'handler.addProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          }
        }
      ]
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            arn: {
              'Fn::GetAtt': ['CatalogBatchQueue', 'Arn'],
            },
            batchSize: 5,
            enabled: true
          }
        }
      ]
    }
  }
};

module.exports = serverlessConfiguration;
