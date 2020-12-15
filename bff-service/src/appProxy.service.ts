import { Injectable, HttpStatus, Request } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AppProxyService {
    async getResource(@Request() req): Promise<object> {
        const { originalUrl, method, body = {} } = req;
        const recipient = originalUrl.split('/')[1];
        const recipientUrl = process.env[recipient];

        if (recipientUrl) {
            try {
                const { data } = await axios({
                    method,
                    url: `${recipientUrl}${originalUrl}`,
                    ...(Object.keys(body).length && { data: body }),
                });

                return {
                    statusCode: HttpStatus.OK,
                    message: 'OK',
                    data,
                };
            } catch (error) {
              return {
                    status: HttpStatus.INTERNAL_SERVER_ERROR,
                    error,
                };
            }
        } else {
            return {
                status: HttpStatus.BAD_GATEWAY,
                message: 'An error within process the request',
            };
        }
    }
}
