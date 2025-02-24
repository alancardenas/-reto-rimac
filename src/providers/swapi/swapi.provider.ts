import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Starship } from '../../modules/retorimac/entity/startship.dto';

@Injectable()
export class SWAPIProvider {
  constructor(private readonly httpSwapiService: HttpService, private readonly httpPokeService: HttpService) {
    this.httpSwapiService.axiosRef.defaults.baseURL = 'https://swapi.py4e.com/api/';
    this.httpPokeService.axiosRef.defaults.baseURL = 'https://pokeapi.co/api/v2/';
  }

  async getAllStarships(): Promise<Starship[]> {
    const response = await firstValueFrom(this.httpSwapiService.get('starships'));
    return response.data.results;
  }

  async getStarshipById(id: number) {
    const response = await firstValueFrom(
      this.httpSwapiService.get(`starships/${id}`),
    );
    return response.data;
  }

  async getStarshipSchema() {
    const response = await firstValueFrom(
      this.httpSwapiService.get('starships/schema'),
    );
    return response.data;
  }


  async getAllPlanets(): Promise<any> {
    const response = await firstValueFrom(this.httpSwapiService.get('planets'));
    return response.data.results;
  }

  async getPlanetsById(id: number) {
    const response = await firstValueFrom(
      this.httpSwapiService.get(`planets/${id}`),
    );
    return response.data;
  }

  async getAllPoke(): Promise<any> {
    const response = await firstValueFrom(this.httpPokeService.get('pokemon'));
    return response.data.results;
  }

  async getPokeById(id: number) {
    const response = await firstValueFrom(
      this.httpPokeService.get(`pokemon/${id}`),
    );
    return response.data;
  }  

}
