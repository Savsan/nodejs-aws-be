import { GetProductByIdQueryType } from './types';

export const createGetProductListQuery = (): string =>
    'select products.*, stocks.count from products inner join stocks on products.id=stocks.product_id';

export const createGetProductByIdQuery = (productId): GetProductByIdQueryType => {
    return ['SELECT * FROM products WHERE id=$1', [productId]];
};
