import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  @Get('fusionados/:id')
  async fusionados(@Param('id') id: string) {
    return await this.appService.fusionados(parseInt(id));
  }

  @Post('almacenar')
  async almacenar(@Body() data: any) {
    return await this.appService.almacenar(data);
  }

  @Get('historial')
  async historial() {
    return await this.appService.historial();
  }
}