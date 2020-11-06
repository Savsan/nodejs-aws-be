export const createGetProductListQuery = (): string =>
    'select products.*, stocks.count from products inner join stocks on products.id=stocks.product_id';
