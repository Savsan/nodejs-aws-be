import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { retrieveProducts, createDbConfig, logErrorRelatedData } from './helpers';
const client = new Client(createDbConfig());

import { DEFAULT_HEADERS } from './constants';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
    try {
        await client.connect();
        const result = await retrieveProducts(3500);

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
    } finally {
        client.end();
    }
};
