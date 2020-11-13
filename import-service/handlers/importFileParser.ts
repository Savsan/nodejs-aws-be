import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';

import { logErrorRelatedData } from './helpers';

import { DEFAULT_HEADERS, UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME } from './constants';

export const importFileParser: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const { Records } = event;
        const s3 = new AWS.S3({
            region: process.env.REGION,
            signatureVersion: 'v4',
        });

        for (const record of Records) {
            const { object } = record.s3;

            await s3
                .copyObject({
                    Bucket: process.env.BUCKET_NAME,
                    CopySource: object.key,
                    Key: object.key.replace(UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME),
                })
                .promise();
        }
    } catch (error) {
        logErrorRelatedData({ event, error });

        return {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: {},
        };
    }
};
