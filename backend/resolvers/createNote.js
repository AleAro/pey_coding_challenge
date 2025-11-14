import { util } from '@aws-appsync/utils';
import * as ddb from '@aws-appsync/utils/dynamodb';

export function request(ctx) {
  const { text, sentiment } = ctx.args;
  const id = util.autoUlid();
  const dateCreated = util.time.nowISO8601();
  
  return ddb.put({
    key: { id, dateCreated },
    item: { text, sentiment }
  });
}

export function response(ctx) {
  return ctx.result;
}