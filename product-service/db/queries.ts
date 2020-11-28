import { ProductQueryWithParamsType, IAddProductQueryParams, IAddStockQueryParams } from './types';

export const createGetProductListQuery = (): string =>
    'select products.*, stocks.count from products inner join stocks on products.id=stocks.product_id';

export const createGetProductByIdQuery = (productId): ProductQueryWithParamsType => {
    return ['SELECT * FROM products WHERE id=$1', [productId]];
};

export const createAddProductQuery = ({
    title,
    description,
    price,
}: IAddProductQueryParams): ProductQueryWithParamsType => {
    return [
        'INSERT INTO products (title, description, price) VALUES ($1, $2, $3) RETURNING id',
        [title, description, price],
    ];
};

export const createAddStockQuery = ({ id, count }: IAddStockQueryParams): ProductQueryWithParamsType => {
    return ['INSERT INTO stocks (product_id, count) VALUES ($1, $2)', [id, count]];
};
