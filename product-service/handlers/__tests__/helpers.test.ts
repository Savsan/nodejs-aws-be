import { retrieveProducts } from '../helpers';
import productList from '../../data/productList.json';

describe('Helpers', () => {
    test('retrieveProducts helper retrieve the products list', async () => {
        expect(await retrieveProducts(100)).toStrictEqual(productList);
    });
});
