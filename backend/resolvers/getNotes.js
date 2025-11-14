import { util } from '@aws-appsync/utils';
import * as ddb from '@aws-appsync/utils/dynamodb';

export function request(ctx) {
  const { sentiment, limit = 10, nextToken } = ctx.args;
  
  if (sentiment) {
    return ddb.query({
      query: {
        sentiment: { eq: sentiment }
      },
      index: 'sentiment-dateCreated-index',
      limit,
      nextToken,
      scanIndexForward: false
    });
  }
  
  return ddb.scan({
    limit,
    nextToken
  });
}

export function response(ctx) {
  const { items = [], nextToken, scannedCount } = ctx.result;
  return {
    items,
    nextToken,
    scannedCount
  };
}