import productList from '../data/productList.json';

import { IProducts } from './types';

export const retrieveProducts = async (delay: number): Promise<IProducts[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(productList), delay));
};
