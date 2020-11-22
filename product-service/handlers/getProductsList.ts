import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DBClient } from '../db';

import { logErrorRelatedData } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const client = new DBClient();
        const result = await client.getProductsList();

        return {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(result),
        };
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
