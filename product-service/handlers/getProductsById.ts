import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'getProductsById function executed successfully!',
            input: event,
        }, null, 2),
    };
};
