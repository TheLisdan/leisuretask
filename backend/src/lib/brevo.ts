import { env } from './env';
import { pick } from '@leisuretask/shared/src/pick';
import axios, { AxiosResponse } from 'axios';

const makeRequestToBrevo = async ({
  path,
  data,
}: {
  path: string;
  data: Record<string, any>;
}): Promise<{
  originalResponse?: AxiosResponse;
  loggableResponse: Pick<AxiosResponse, 'status' | 'statusText' | 'data'>;
}> => {
  if (!env.BREVO_API_KEY) {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: {
          message: 'Brevo API key not set, skipping request',
        },
      },
    };
  }
  const response = await axios({
    method: 'POST',
    url: `https://api.brevo.com/v3/${path}`,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': env.BREVO_API_KEY,
    },
    data,
  });
  return {
    originalResponse: response,
    loggableResponse: pick(response, ['status', 'statusText', 'data']),
  };
};

export const sendEmailThroughBrevo = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  return await makeRequestToBrevo({
    path: 'smtp/email',
    data: {
      subject,
      htmlContent: html,
      sender: { email: env.FROM_EMAIL_ADDRESS, name: env.FROM_EMAIL_NAME },
      to: [{ email: to }],
    },
  });
};
