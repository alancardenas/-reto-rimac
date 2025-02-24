import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  public async fusionados(payload: any): Promise<any> {
    const id = payload.path.id;
    return await this.appService.fusionados(id);
  }

  public async almacenar(request: any): Promise<any> {
    console.log('AC - request:', request);
    return await this.appService.almacenar();
  }
  
  public async historial(): Promise<any> {
    return await this.appService.historial();
  }
}
