import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { DBClient } from '../db';

import { logErrorRelatedData, isAddProductBodyParamsValid } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const addProduct: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const client = new DBClient();
        const body = JSON.parse(event.body);
        const isBodyParamsValid = isAddProductBodyParamsValid(body);

        if (isBodyParamsValid) {
            await client.addProduct(body);
        } else {
            const error = {
                message: 'Product data is not valid.',
            };
            logErrorRelatedData({ event, error });

            return {
                statusCode: 400,
                headers: DEFAULT_HEADERS,
                body: JSON.stringify(error),
            };
        }

        return {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: 'Product was created successfully!',
            }),
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
