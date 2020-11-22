import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';

import { logErrorRelatedData, processRecords, sendMessageToCatalogBatchQueue } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const importFileParser: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const { Records } = event;
        const { REGION } = process.env;
        const s3 = new AWS.S3({
            region: REGION,
            signatureVersion: 'v4',
        });
        const sqs = new AWS.SQS({ region: REGION });

        const data = await processRecords({ s3, Records });
        await sendMessageToCatalogBatchQueue({ sqs, messages: data });

        return {
            statusCode: 202,
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
