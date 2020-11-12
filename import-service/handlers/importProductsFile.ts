import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';

import { logErrorRelatedData } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const s3 = new AWS.S3({ region: process.env.REGION });
        const catalogPath = 'uploaded/catalog.csv';
        const params = {
            Bucket: 'import-service-production-bucket',
            Key: catalogPath,
            Expires: 60,
            ContentType: 'text/csv',
        };
        s3.getSignedUrl('putObject', params, (error, url) => {
            console.log(url);
        });

        return {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: {
                message: 'Hello from importProductsFile lambda!!!',
            },
        };
    } catch (error) {
        logErrorRelatedData({ event, error });

        return {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: {
                message: 'Internal server error.',
            },
        };
    }
};
