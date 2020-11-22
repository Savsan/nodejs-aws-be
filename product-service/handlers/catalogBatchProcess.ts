import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DBClient } from '../db';

import { isAddProductBodyParamsValid, logErrorRelatedData } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const catalogBatchProcess: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const { Records } = event;
        const client = new DBClient();

        for (const record of Records) {
            const body = JSON.parse(record.body);
            const isBodyParamsValid = isAddProductBodyParamsValid(body);

            if (isBodyParamsValid) {
                await client.addProduct(body);
            } else {
                // TODO: Implement adding wrong record to dead-letter queue
                console.log();
            }
        }
    } catch (error) {
        logErrorRelatedData({ event, error });

        return {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: 'Internal server error.',
            }),
        };
    }
};
