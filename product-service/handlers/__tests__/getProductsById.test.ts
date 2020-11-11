import { getProductsById } from '../getProductsById';
import { DEFAULT_HEADERS } from '../constants';
import productList from '../../data/productList.json';

const correctIdMock = '7567ec4b-b10c-48c5-9345-fc73c48a80aa';
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
        productId: correctIdMock,
    },
};

jest.mock('pg', () => ({
    Client: jest.fn(() => ({
        connect: jest.fn(),
        // @ts-ignore
        query: jest.fn().mockImplementation((queryString, idArray) => {
            if (idArray[0] === correctIdMock) {
                return {
                    rows: [productList[0]],
                };
            } else {
                throw 'Some PG query error';
            }
        }),
        end: jest.fn(),
    })),
}));

describe('getProductsById handler', () => {
    test('returns STATUS CODE 200 with product', async () => {
        const expectedResult = {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(productList[0]),
        };
        // @ts-ignore
        const result = await getProductsById(eventMock);
        expect(result).toStrictEqual(expectedResult);
    });

    test('returns STATUS CODE 500 with appropriate message when query error', async () => {
        const expectedResult = {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: 'Internal server error',
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
