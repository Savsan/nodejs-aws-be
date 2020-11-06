import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { createDbConfig, logErrorRelatedData } from './helpers';
import { createGetProductListQuery } from './queries';

const client = new Client(createDbConfig());

import { DEFAULT_HEADERS } from './constants';

export const getProductsList: APIGatewayProxyHandler = async (event) => {
    try {
        await client.connect();
        const { rows: result } = await client.query(createGetProductListQuery());

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
