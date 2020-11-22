import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';
import { DBClient } from '../db';

import { isAddProductBodyParamsValid, logErrorRelatedData, publishToImportProductsSnsTopic } from './helpers';

import { DEFAULT_HEADERS } from './constants';

export const catalogBatchProcess: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    const client = new DBClient();

    try {
        const { REGION } = process.env;
        const addedProducts = [];
        const { Records } = event;
        const sns = new AWS.SNS({ region: REGION });
        await client.connect();

        for (const record of Records) {
            const body = JSON.parse(record.body);
            const isBodyParamsValid = isAddProductBodyParamsValid(body);

            if (isBodyParamsValid) {
                await client.addProduct(body);
                addedProducts.push(body);
            } else {
                // TODO: Implement adding wrong record to dead-letter queue

                await publishToImportProductsSnsTopic({
                    sns,
                    products: body,
                    status: 'FAILURE',
                });
            }
        }

        await publishToImportProductsSnsTopic({
            sns,
            products: addedProducts,
            status: 'SUCCESS',
        });
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
        await client.end();
    }
};
