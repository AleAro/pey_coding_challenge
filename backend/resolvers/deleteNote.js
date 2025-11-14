import { util } from '@aws-appsync/utils';
import * as ddb from '@aws-appsync/utils/dynamodb';

export function request(ctx) {
  const { id, dateCreated } = ctx.args;
  
  return ddb.remove({
    key: { id, dateCreated }
  });
}

export function response(ctx) {
  return ctx.result;
}