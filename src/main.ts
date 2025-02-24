import serverlessExpress from '@codegenie/serverless-express';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppController } from './app.controller';

let server: Handler;

function setupSwagger(app: INestApplication) {
  const stage = process.env.STAGE || 'dev';
  const apiPath = process.env.IS_OFFLINE ? '' : `/${stage}`;

  const options = new DocumentBuilder()
    .setTitle('SWAPI API')
    .setDescription('SWAPI API REST API documentation')
    .setVersion('1.0.0')
    .addServer(apiPath)
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap(event: any): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.init();

  // Extraer acción del evento
  const method = event.httpMethod;
  const body = JSON.parse(event.body);
  console.log('AC - method:', method);
  //const action = event.pathParameters?.action;
  const path = event.pathParameters;
  console.log('AC - path:', path);
  console.log('AC - body:', body);
  const payload = {
    body: body?.payload,
    path
  }
  const action = path?.action;
  if (action) {
    console.log(`AC - Ejecutando acción: ${action}`);
    const appController = app.select(AppModule).get(AppController, { strict: false });

    // Verifica si la acción existe en el controlador y la ejecuta
    if (typeof appController[action] === 'function') {
      return await appController[action](payload);
    } else {
      console.error(`AC - Acción '${action}' no encontrada en AppController`);
      throw new Error(`Acción '${action}' no encontrada`);
    }
  }

  // Si no hay una acción específica, usar serverlessExpress
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  console.log('AC - event:', event);
  if (!server) {
    server = await bootstrap(event);
  }
  return server(event, context, callback);
};
