import { IAddProductBody } from '../db/types';

export const logErrorRelatedData = ({ event, error }) => {
    console.log('ERROR: ', error);
    console.log('EVENT: ', event);
};

export const isAddProductBodyParamsValid = (body: IAddProductBody): boolean => {
    const { title, description, price, count } = body;

    return !(!title || !description || !price || !count);
};
