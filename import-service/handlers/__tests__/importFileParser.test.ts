import { importProductsFile } from '../importProductsFile';
import { DEFAULT_HEADERS } from '../constants';

const eventMock = {
    body: undefined,
    headers: {},
    httpMethod: '',
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: undefined,
    path: undefined,
    queryStringParameters: {
        name: 'foo.csv',
    },
    requestContext: undefined,
    resource: '',
    stageVariables: undefined,
    pathParameters: undefined,
};
const signedUrlMock = `https://s3.aws.com/signed-url?name=${eventMock.queryStringParameters.name}`;

jest.mock('aws-sdk', () => ({
    S3: jest.fn(() => ({
        getSignedUrl: jest.fn().mockImplementation((_, params) => {
            if (params.Key.includes(eventMock.queryStringParameters.name)) {
                return signedUrlMock;
            } else {
                throw 'Error';
            }
        }),
    })),
}));

describe('importProductsFile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Returns signed URL', async () => {
        const expectedResult = {
            headers: DEFAULT_HEADERS,
            body: signedUrlMock,
            statusCode: 200,
        };
        //@ts-ignore
        expect(await importProductsFile(eventMock)).toEqual(expectedResult);
    });

    it('Returns internal server error with code 500 if getSignedUrl method of S3 fails', async () => {
        const expectedResult = {
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({
                message: 'Internal server error.',
            }),
            statusCode: 500,
        };

        expect(
            //@ts-ignore
            await importProductsFile({
                ...eventMock,
                queryStringParameters: {
                    name: null,
                },
            }),
        ).toEqual(expectedResult);
    });
});
