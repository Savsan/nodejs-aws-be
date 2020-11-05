import productList from '../data/productList.json';

import { IProducts } from './types';

export const retrieveProducts = async (delay: number): Promise<IProducts[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(productList), delay));
};

export const createDbConfig = () => {
    return {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        // connectionString?: string, // e.g. postgres://user:password@host:5432/database
        ssl: {
            rejectUnauthorized: false,
        },
        // types?: any, // custom type parsers
        statement_timeout: 5000,
        // query_timeout?: number, // number of milliseconds before a query call will timeout, default is no timeout
        // connectionTimeoutMillis?: number, // number of milliseconds to wait for connection, default is no timeout
        // idle_in_transaction_session_timeout?: number // number of milliseconds before terminating any session with an open idle transaction, default is no timeout
    };
};
