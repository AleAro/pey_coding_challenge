import { Amplify } from 'aws-amplify';

Amplify.configure(
  {
    aws_project_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    aws_appsync_region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    aws_appsync_authenticationType: 'API_KEY',
    aws_appsync_apiKey: process.env.NEXT_PUBLIC_APPSYNC_API_KEY,
    aws_appsync_graphqlEndpoint: process.env.NEXT_PUBLIC_APPSYNC_ENDPOINT || 'https://5xvy4x6rgjh5fmklzs6vgrwiqq.appsync-api.us-east-1.amazonaws.com/graphql',
  } as any, // Suppress type error for extra property
  { ssr: true }
);

export default Amplify;