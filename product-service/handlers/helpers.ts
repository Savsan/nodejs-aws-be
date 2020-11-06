import { IDbConfig } from './types';

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
