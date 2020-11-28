import csv from 'csv-parser';
import { UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME } from './constants';

export const logErrorRelatedData = ({ event, error }): void => {
    console.log('ERROR: ', error);
    console.log('EVENT: ', event);
};

export const readObjectFromStream = (s3Stream): Promise<any> => {
    return new Promise((resolve, reject) => {
        const result = [];
        s3Stream
            .pipe(csv())
            .on('data', (data) => {
                result.push(data);
            })
            .on('error', (error) => reject(error))
            .on('end', () => resolve(result));
    });
};

export const processRecords = async ({ s3, Records }) => {
    const { BUCKET_NAME } = process.env;
    const result = [];

    for (const record of Records) {
        const { object } = record.s3;
        const recordData = await readObjectFromStream(
            s3
                .getObject({
                    Bucket: BUCKET_NAME,
                    Key: object.key,
                })
                .createReadStream(),
        );
        result.push(...recordData);
        console.log('DATA: ', recordData);

        await s3
            .copyObject({
                Bucket: BUCKET_NAME,
                CopySource: `${BUCKET_NAME}/${object.key}`,
                Key: object.key.replace(UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME),
            })
            .promise();

        await s3
            .deleteObject({
                Bucket: BUCKET_NAME,
                Key: object.key,
            })
            .promise();
    }

    return result;
};

export const sendMessageToCatalogBatchQueue = ({ messages, sqs }) => {
    const { SQS_CATALOG_BATCH_QUEUE_URL } = process.env;

    return Promise.all(
        messages.map(async (message) => {
            try {
                await sqs
                    .sendMessage({
                        QueueUrl: SQS_CATALOG_BATCH_QUEUE_URL,
                        MessageBody: JSON.stringify(message),
                    })
                    .promise();

                console.log(`CATALOG_BATCH_QUEUE message was sent: ${message}`);
            } catch (error) {
                throw error;
            }
        }),
    );
};
