import productList from '../data/productList.json';

import { IProducts, IDbConfig } from './types';

export const retrieveProducts = async (delay: number): Promise<IProducts[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(productList), delay));
};

export const createDbConfig = (): IDbConfig => {
    return {
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        ssl: {
            rejectUnauthorized: false,
        },
        statement_timeout: 5000,
    };
};

export const logErrorRelatedData = ({ event, error }) => {
    console.log('ERROR: ', error);
    console.log('EVENT: ', event);
};
