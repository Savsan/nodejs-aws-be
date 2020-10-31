import { getProductsList } from '../getProductsList';
import productList from '../../data/productList.json';

describe('getProductsList handler', () => {
    test('returns STATUS CODE 200 with list of products', async () => {
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(productList),
        };
        // @ts-ignore
        const result = await getProductsList();
        expect(result).toStrictEqual(expectedResult);
    });
});
