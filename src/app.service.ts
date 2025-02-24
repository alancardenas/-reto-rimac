import { Injectable } from '@nestjs/common';
import { ApisProvider } from './providers/swapi/swapi.provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  ddbDocClient: DynamoDBDocument;

  constructor(private readonly apisProvider: ApisProvider) {
    const dynamoDBClient = new DynamoDBClient();
    this.ddbDocClient = DynamoDBDocument.from(dynamoDBClient);
  }

  async create(data: any) {
    await this.ddbDocClient.put({
      TableName: process.env.TABLA_FUSIONADOS,
      Item: {
        ...data,
        id: uuidv4(),
        created: new Date().toISOString(),
        edited: new Date().toISOString(),
      },
    });
  }

  async obtieneTotalConsultas() {
    const results = await this.ddbDocClient.scan({
      TableName: process.env.TABLA_FUSIONADOS,
    });
    return results.Items;
  }

  public async fusionados(id: number): Promise<any> {
    console.log('Ac - id: ', id);
    const [planet, poke] = await Promise.all([
      this.apisProvider.getPlanetsById(id),
      this.apisProvider.getPokeById(id),
    ]);
    const fusionados = {
      planet,
      poke
    }
    await this.create(fusionados);
    return { data: fusionados, message: 'Elementos fusionados correctamente' };
  }

  public async almacenar(payload: object): Promise<any> {
    console.log('Ac - Hello almacenar!');
    await this.create(payload);
    return { data: payload, message: 'Elementos almacenados correctamente' };
  }

  public async historial(): Promise<any> {
    console.log('Ac - Hello historial!');
    const data = await this.obtieneTotalConsultas();
    return { data, message: 'Historial obtenido correctamente' };
  }
}
