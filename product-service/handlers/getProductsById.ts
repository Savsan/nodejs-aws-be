import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { createDbConfig, logErrorRelatedData } from './helpers';
import { createGetProductByIdQuery } from './queries';

import { DEFAULT_HEADERS } from './constants';

export const getProductsById: APIGatewayProxyHandler = async (event) => {
    const { productId } = event.pathParameters;
    const client = new Client(createDbConfig());
    console.log('EVENT_LOG: ', event);
    try {
        await client.connect();
        const { rows: product } = await client.query(...createGetProductByIdQuery(productId));

        if (product[0]) {
            return {
                statusCode: 200,
                headers: DEFAULT_HEADERS,
                body: JSON.stringify(product[0]),
            };
        }
    } catch (error) {
        logErrorRelatedData({ event, error });

        return {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: 'Internal server error',
            }),
        };
    } finally {
        client.end();
    }
};
