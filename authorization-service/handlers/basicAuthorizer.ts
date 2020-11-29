import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import { logErrorRelatedData } from './helpers';

const { TEST_USER, TEST_PASSWORD } = process.env;

const generatePolicy = (principalId, resource, effect = 'Allow') => ({
    principalId,
    policyDocument: {
        Version: '2012-10-17',
        Statement: [
            {
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            },
        ],
    },
});

export const basicAuthorizer: APIGatewayProxyHandler = async (event, _, callback) => {
    console.log('EVENT_LOG: ', event);
    try {
        const { authorizationToken, methodArn } = event;
        const encodedCredentials = authorizationToken.split(' ')[1];
        const buffer = Buffer.from(encodedCredentials, 'base64');
        const [username, password] = buffer.toString('utf-8').split(':');
        const effect = username === TEST_USER || password === TEST_PASSWORD ? 'Allow' : 'Deny';
        const policy = generatePolicy(encodedCredentials, methodArn, effect);

        console.log(`Credentials: ${username}:${password}`);
        console.log(`Policy: ${JSON.stringify(policy)}`);

        callback(null, policy);
    } catch (error) {
        logErrorRelatedData({ event, error });

        callback(`Unauthorized ${error.message}`);
    }
};
