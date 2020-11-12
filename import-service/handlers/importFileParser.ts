import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { logErrorRelatedData } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const importFileParser: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    return {
        statusCode: 200,
        headers: DEFAULT_HEADERS,
        body: {
            message: 'Hello from importFileParser lambda!!!',
        },
    };
};
