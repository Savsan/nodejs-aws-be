import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { retrieveProducts } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const getProductsList: APIGatewayProxyHandler = async () => {
    try {
        const result = await retrieveProducts(3500);

        return {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(result),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: 'Internal server error.',
            }),
        };
    }
};
