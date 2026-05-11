import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

import { assert } from './assert';
import { createLogger } from './logger';

const logger = createLogger('@common/lambda-client');
const lambdaClient = new LambdaClient({});
const textDecoder = new TextDecoder();


export const makeLambdaRequest = async <TRequest, TResponse>(
  functionName: string,
  payload: TRequest,
): Promise<TResponse> => {
  logger.info(`Making request to Lambda function ${functionName} with payload: `, { payload });

  const message = JSON.stringify(payload);
  logger.info('Sending request: ', { message });

  const response = await lambdaClient.send(new InvokeCommand({
    FunctionName: functionName,
    Payload: message,
  }));
  logger.info('Request sent: ', { response });

  assert(!!response.Payload, 'Response payload is empty');

  const result: TResponse = JSON.parse(textDecoder.decode(response.Payload));
  logger.info('Received response: ', { result });

  return result;
}