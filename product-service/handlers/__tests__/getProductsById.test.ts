import { getProductsById } from '../getProductsById';

const eventMock = {
    body: undefined,
    headers: {},
    httpMethod: '',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: undefined,
    path: '',
    queryStringParameters: undefined,
    requestContext: undefined,
    resource: '',
    stageVariables: undefined,
    pathParameters: {
        productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
    },
};

describe('getProductsById handler', () => {
    test('returns STATUS CODE 200 with product', async () => {
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify({
                count: 4,
                description: 'Description',
                id: '7567ec4b-b10c-48c5-9345-fc73c48a80aa',
                price: 2.4,
                title: 'Hugo Boss Hugo Urban Journey',
            }),
        };
        // @ts-ignore
        const result = await getProductsById(eventMock);
        expect(result).toStrictEqual(expectedResult);
    });

    test('returns STATUS CODE 404 with appropriate message when product was not fount', async () => {
        const expectedResult = {
            statusCode: 404,
            body: JSON.stringify({
                message: 'Requested product is not exist.',
            }),
        };
        // @ts-ignore
        const result = await getProductsById({
            ...eventMock,
            pathParameters: {
                productId: 'someWrongId',
            },
        });
        expect(result).toStrictEqual(expectedResult);
    });
});
