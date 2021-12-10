import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda'
import * as cdk from '@aws-cdk/core'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class DynamoApiCodeStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
      tableName: 'books',
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    const getTodosLambda = new lambda.Function(this, 'listItems', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'listItems.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        'TABLE': 'books',
        'DEBUG': 'true',
      }
    });

    const createItemLambda = new lambda.Function(this, 'createItems', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'createItem.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        'TABLE': 'books',
        'DEBUG': 'true',
      }
    });

    const updateItemLambda = new lambda.Function(this, 'updateItems', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'updateItem.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        'TABLE': 'books',
        'DEBUG': 'true',
      }
    });

    const deleteItemLambda = new lambda.Function(this, 'deleteItems', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'deleteItem.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        'TABLE': 'books',
        'DEBUG': 'true',
      }
    });

    table.grantReadWriteData(getTodosLambda);
    table.grantReadWriteData(createItemLambda);
    table.grantReadWriteData(updateItemLambda);
    table.grantReadWriteData(deleteItemLambda);

    const api = new apigateway.RestApi(this, 'api', {
        deployOptions: {
        stageName: 'dev',
      },
    });

    const version = api.root.addResource('v1');
    const todos = version.addResource('todos');
    todos.addMethod('GET', new apigateway.LambdaIntegration(getTodosLambda));
    todos.addMethod('POST', new apigateway.LambdaIntegration(createItemLambda));
    const singleTodo = todos.addResource('{todoId}');
    singleTodo.addMethod('GET', new apigateway.LambdaIntegration(getTodosLambda));
    singleTodo.addMethod('PUT', new apigateway.LambdaIntegration(updateItemLambda));
    singleTodo.addMethod('DELETE', new apigateway.LambdaIntegration(deleteItemLambda));
  }
}
