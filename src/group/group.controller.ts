import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';

import { GroupService } from './group.service';
//роутер
@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  getFilesNamesFromGroup(@Param('id', ParseIntPipe) id: number) {
    return this.groupService.getFilesNamesFromGroup(id);
  }

  @Post(':id')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-Type', 'application/json')
  addToGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body('devices_id', ParseIntPipe) devices_id: number,
  ) {
    return this.groupService.addToGroup(id, devices_id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/json')
  deleteFromGroup(
    @Param('id', ParseIntPipe) id: number,
    @Body('devices_id', ParseIntPipe) devices_id: number,
  ) {
    return this.groupService.deleteFromGroup(id, devices_id);
  }
}
