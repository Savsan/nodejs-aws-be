import csv from 'csv-parser';

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
