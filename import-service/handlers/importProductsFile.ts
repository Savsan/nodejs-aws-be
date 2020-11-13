import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';

import { logErrorRelatedData } from './helpers';

import { DEFAULT_HEADERS, UPLOAD_FOLDER_NAME } from './constants';

export const importProductsFile: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const { name: fileName } = event.queryStringParameters;
        const s3 = new AWS.S3({
            region: process.env.REGION,
            signatureVersion: 'v4',
        });
        const catalogPath = `${UPLOAD_FOLDER_NAME}/${fileName}`;
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: catalogPath,
            Expires: 5000,
            ContentType: 'text/csv',
        };
        const url = s3.getSignedUrl('putObject', params);

        return {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: url,
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
