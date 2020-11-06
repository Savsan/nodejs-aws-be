export interface IProducts {
    count: number;
    description: string;
    id: string;
    price: number;
    title: string;
}

export interface IDbConfig {
    user: string;
    password: string;
    host: string;
    database: string;
    port: string;
    ssl: {
        rejectUnauthorized: boolean;
    };
    statement_timeout: number;
}

export type GetProductByIdQueryType = Array<string, [string]>;
