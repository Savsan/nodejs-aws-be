export interface IAddProductBody {
    count: number;
    description: string;
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

export interface IAddProductQueryParams {
    title: string;
    description: string;
    price: number;
}

export interface IAddStockQueryParams {
    id: number;
    count: number;
}

export type ProductQueryWithParamsType = Array<string, [string]>;
