import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { find } from 'lodash';

import { retrieveProducts } from './helpers';
import { DEFAULT_HEADERS } from './constants';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    const { productId } = event.pathParameters;

    try {
        const productList = await retrieveProducts(2000);
        const product = find(productList, (product) => product.id === productId);

        if (product) {
            return {
                statusCode: 200,
                headers: DEFAULT_HEADERS,
                body: JSON.stringify(product),
            };
        } else {
            throw 'Requested product is not exist.';
        }
    } catch (error) {
        return {
            statusCode: 404,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: error,
            }),
        };
    }
};
