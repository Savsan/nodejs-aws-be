import { Client } from 'pg';
import { createDbConfig } from './helpers';
import {
    createAddProductQuery,
    createAddStockQuery,
    createGetProductByIdQuery,
    createGetProductListQuery,
} from './queries';
import { BEGIN_DB_TRANSACTION, COMMIT_DB_TRANSACTION, ROLLBACK_DB_TRANSACTION } from './constants';

import { IAddProductBody } from './types';

export default class DBClient {
    protected client = null;

    constructor() {
        this.client = new Client(createDbConfig());
    }

    addProduct = async (body: IAddProductBody): Promise<void> => {
        try {
            const { title, description, price, count } = body;
            const productPayload = {
                title: title.trim(),
                description: description.trim(),
                price,
            };

            await this.client.connect();
            await this.client.query(BEGIN_DB_TRANSACTION);
            const {
                rows: [{ id }],
            } = await this.client.query(...createAddProductQuery(productPayload));
            await this.client.query(...createAddStockQuery({ id, count }));
            await this.client.query(COMMIT_DB_TRANSACTION);
        } catch (e) {
            await this.client.query(ROLLBACK_DB_TRANSACTION);

            throw e;
        } finally {
            await this.client.end();
        }
    };

    getProductsList = async (): Promise<IAddProductBody[] | void> => {
        try {
            await this.client.connect();
            const { rows: result } = await this.client.query(createGetProductListQuery());

            return result;
        } catch (e) {
            throw e;
        } finally {
            await this.client.end();
        }
    };

    getProductById = async (productId: string): Promise<IAddProductBody[] | void> => {
        try {
            await this.client.connect();
            const { rows: product } = await this.client.query(...createGetProductByIdQuery(productId));

            return product;
        } catch (e) {
            throw e;
        } finally {
            await this.client.end();
        }
    };
}
