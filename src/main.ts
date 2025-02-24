import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';
import { AppController } from './app.controller';

function setupSwagger(app: INestApplication) {
  const stage = process.env.STAGE ?? 'dev';
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

async function bootstrap(event: APIGatewayProxyEvent): Promise<any> {
  console.log("🚀 ~ bootstrap ~ event:", JSON.stringify(event));

  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  await app.init();

  const method = event.httpMethod;
  const path = event.path;
  const pathParams = event.pathParameters || {};
  const body = event.body ? JSON.parse(event.body) : {};

  let response;

  try {
    const appController = app.select(AppModule).get(AppController, { strict: false });

    // Redirigir a la función correcta dentro de AppController
    if (method === 'GET' && path.startsWith('/fusionados')) {
      response = await appController.fusionados(pathParams.id);
    } else if (method === 'POST' && path.startsWith('/almacenar')) {
      response = await appController.almacenar(body);
    } else if (method === 'GET' && path.startsWith('/historial')) {
      response = await appController.historial();
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Ruta no encontrada" })
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error("🚨 Error en la ejecución:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor", error: error.message })
    };
  }
}

export const handler: Handler = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log('🚀 ~ handler ~ event:', event);
  return await bootstrap(event);
};