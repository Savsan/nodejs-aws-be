import { getProductsList } from '../getProductsList';
import productList from '../../data/productList.json';
import { DEFAULT_HEADERS } from '../constants';

jest.mock('pg', () => ({
    Client: jest.fn(() => ({
        connect: jest.fn(),
        query: jest.fn().mockImplementation(() => ({
            rows: productList,
        })),
        end: jest.fn(),
    })),
}));

describe('getProductsList handler', () => {
    test('returns STATUS CODE 200 with list of products', async () => {
        const expectedResult = {
            statusCode: 200,
            headers: DEFAULT_HEADERS,
            body: JSON.stringify(productList),
        };
        // @ts-ignore
        const result = await getProductsList();
        expect(result).toStrictEqual(expectedResult);
    });
});
