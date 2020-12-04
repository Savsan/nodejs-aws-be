import type { Serverless } from 'serverless/aws';
import dotenv from 'dotenv';
dotenv.config();

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
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
      BUCKET_NAME: process.env.BUCKET_NAME,
      SQS_CATALOG_BATCH_QUEUE_URL: {
        'Fn::ImportValue': 'CatalogBatchQueueUrl'
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: 'arn:aws:s3:::import-service-production-bucket'
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: 'arn:aws:s3:::import-service-production-bucket/*'
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: {
          'Fn::ImportValue': 'CatalogBatchQueueArn'
        }
      },
    ]
  },
  resources: {
    Resources: {
      GatewayResponseDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'"
          },
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          }
        }
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Credentials': "'true'"
          },
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            Ref: 'ApiGatewayRestApi',
          }
        }
      }
    }
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            authorizer: {
              name: 'basicAuthorizer',
              arn: '${cf:authorization-service-' + `${process.env.STAGE}` + '.BasicAuthorizerLambdaFunctionQualifiedArn}',
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token'
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: 'import-service-production-bucket',
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '.csv',
              },
            ],
            existing: true,
          }
        }
      ]
    },
  }
};

module.exports = serverlessConfiguration;
