import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ApisProvider {
  constructor() {  }

  async getPlanetsById(id: number) {
    const response = await axios.get(`https://swapi.dev/api/planets/${id}`);
    return response.data;
  }

  async getPokeById(id: number) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
  }  

}
