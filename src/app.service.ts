import { Injectable } from '@nestjs/common';
import { SWAPIProvider } from './providers/swapi/swapi.provider';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AppService {
  ddbDocClient: DynamoDBDocument;

  constructor(private swapiProvider: SWAPIProvider) {
    const dynamoDBClient = new DynamoDBClient();
    this.ddbDocClient = DynamoDBDocument.from(dynamoDBClient);
  }

  async findAll() {
    const planets = await this.swapiProvider.getAllPlanets();
    return planets;
  }

  async findPlanetById(id: number) {
    const planet = await this.swapiProvider.getPlanetsById(id);
    return planet;
  }

  async findPokeById(id: number) {
    const poke = await this.swapiProvider.getPokeById(id);
    return poke;
  }

  async create(fusionados: any) {
    await this.ddbDocClient.put({
      TableName: process.env.TABLA_FUSIONADOS,
      Item: {
        ...fusionados,
        id: uuidv4(),
        created: new Date().toISOString(),
        edited: new Date().toISOString(),
      },
    });
  }

  public async fusionados(id: number): Promise<any> {
    console.log('Ac - id: ', id);
    const planet = await this.findPlanetById(id);
    const poke = await this.findPokeById(id)
    const fusionados = {
      planet,
      poke
    }
    //this.create(fusionados);

    console.log('Ac - fusionados: ', fusionados);
    return fusionados;
  }

  public async almacenar(): Promise<string> {
    console.log('Ac - Hello almacenar!');
    return 'Hello 2!';
  }

  public async historial(): Promise<string> {
    console.log('Ac - Hello historial!');
    return 'Hello 3!';
  }
}
