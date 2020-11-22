import { IAddProductBody } from '../db/types';

export const logErrorRelatedData = ({ event, error }) => {
    console.log('ERROR: ', error);
    console.log('EVENT: ', event);
};

export const isAddProductBodyParamsValid = (body: IAddProductBody): boolean => {
    const { title, description, price, count } = body;

    return !(!title || !description || !price || !count);
};

export const publishToImportProductsSnsTopic = ({ sns, products, status }): Promise<any> => {
    return sns
        .publish({
            Subject: `New products adding ${status}`,
            Message: JSON.stringify(products),
            TopicArn: process.env.IMPORT_PRODUCT_SNS_TOPIC_ARN,
            MessageAttributes: {
                status: status,
            },
        })
        .promise();
};
