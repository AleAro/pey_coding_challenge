import { util } from '@aws-appsync/utils';
import * as ddb from '@aws-appsync/utils/dynamodb';

export function request(ctx) {
  const { id, dateCreated, text, sentiment } = ctx.args;
  
  return ddb.update({
    key: { id, dateCreated },
    update: {
      text,
      sentiment
    }
  });
}

export function response(ctx) {
  return ctx.result;
}