import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';

import { createDbConfig, logErrorRelatedData, validateAddProductBodyParams } from './helpers';
import { createAddProductQuery, createAddStockQuery } from './queries';

import { DEFAULT_HEADERS, BEGIN_DB_TRANSACTION, COMMIT_DB_TRANSACTION, ROLLBACK_DB_TRANSACTION } from './constants';

export const addProduct: APIGatewayProxyHandler = async (event) => {
    const client = new Client(createDbConfig());
    console.log('EVENT_LOG: ', event);
    try {
        const body = JSON.parse(event.body);
        const isBodyParamsValid = validateAddProductBodyParams(body);

        if (isBodyParamsValid) {
            const { title, description, price, count } = body;
            const productPayload = {
                title: title.trim(),
                description: description.trim(),
                price,
            };

            await client.connect();
            await client.query(BEGIN_DB_TRANSACTION);
            const {
                rows: [{ id }],
            } = await client.query(...createAddProductQuery(productPayload));
            await client.query(...createAddStockQuery({ id, count }));
            await client.query(COMMIT_DB_TRANSACTION);

            return {
                statusCode: 200,
                headers: DEFAULT_HEADERS,
                body: JSON.stringify({
                    message: 'Product was created successfully!',
                }),
            };
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
    } catch (error) {
        await client.query(ROLLBACK_DB_TRANSACTION);
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
