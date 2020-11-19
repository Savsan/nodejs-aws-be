import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import AWS from 'aws-sdk';

import { logErrorRelatedData, readObjectFromStream } from './helpers';

import { DEFAULT_HEADERS, UPLOAD_FOLDER_NAME, PARSED_FOLDER_NAME } from './constants';

export const importFileParser: APIGatewayProxyHandler = async (event) => {
    console.log('EVENT_LOG: ', event);
    try {
        const { Records } = event;
        const { REGION, BUCKET_NAME } = process.env;
        const s3 = new AWS.S3({
            region: REGION,
            signatureVersion: 'v4',
        });

        for (const record of Records) {
            const { object } = record.s3;
            const data = await readObjectFromStream(
                s3
                    .getObject({
                        Bucket: BUCKET_NAME,
                        Key: object.key,
                    })
                    .createReadStream(),
            );
            console.log('DATA: ', data);

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

        return {
            statusCode: 202,
        };
    } catch (error) {
        logErrorRelatedData({ event, error });

        return {
            statusCode: 500,
            headers: DEFAULT_HEADERS,
            body: {
                message: 'Internal server error.',
            },
        };
    }
};
