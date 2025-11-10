import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as appsync from 'aws-cdk-lib/aws-appsync';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Crear tabla DynamoDB
    const notesTable = new dynamodb.Table(this, 'NotesTable', {
      tableName: 'NotesTable-CDK',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'dateCreated',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Para desarrollo, en producción usar RETAIN
    });

    // 2. Crear Global Secondary Index para filtrar por sentiment
    notesTable.addGlobalSecondaryIndex({
      indexName: 'sentiment-dateCreated-index',
      partitionKey: {
        name: 'sentiment',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'dateCreated',
        type: dynamodb.AttributeType.STRING,
      },
    });

    // 3. Crear API GraphQL con AppSync
    const api = new appsync.GraphqlApi(this, 'NotesApi', {
      name: 'NotesAPI-CDK',
      definition: appsync.Definition.fromFile('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
      },
      xrayEnabled: true,
    });

    // 4. Crear Data Source para DynamoDB
    const dataSource = api.addDynamoDbDataSource(
      'NotesTableDataSource',
      notesTable
    );

    // 5. Crear Resolver para createNote
    dataSource.createResolver('CreateNoteResolver', {
      typeName: 'Mutation',
      fieldName: 'createNote',
      code: appsync.Code.fromAsset('resolvers/createNote.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // 6. Crear Resolver para getNotes
    dataSource.createResolver('GetNotesResolver', {
      typeName: 'Query',
      fieldName: 'getNotes',
      code: appsync.Code.fromAsset('resolvers/getNotes.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // 7. Crear Resolver para updateNote
    dataSource.createResolver('UpdateNoteResolver', {
      typeName: 'Mutation',
      fieldName: 'updateNote',
      code: appsync.Code.fromAsset('resolvers/updateNote.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // 8. Crear Resolver para deleteNote
    dataSource.createResolver('DeleteNoteResolver', {
      typeName: 'Mutation',
      fieldName: 'deleteNote',
      code: appsync.Code.fromAsset('resolvers/deleteNote.js'),
      runtime: appsync.FunctionRuntime.JS_1_0_0,
    });

    // Outputs
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl,
    });

    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || '',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: notesTable.tableName,
    });
  }
}