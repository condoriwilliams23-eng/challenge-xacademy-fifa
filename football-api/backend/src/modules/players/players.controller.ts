import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { PlayersService } from './players.service';
import { PlayerDto } from './dto/player.dto';
import { QueryPlayerDto } from './dto/query-player.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async getPlayers(@Query() query: QueryPlayerDto) {
    const result = await this.playersService.getPlayers(query);
    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      data: result.players.map((p) => new PlayerDto(p)),
    };
  }

  @Get('export/csv')
  async exportCsv(@Query() query: QueryPlayerDto, @Res() res: Response) {
    const buffer = await this.playersService.exportPlayersCsv(query);
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="players.csv"',
    });
    return res.send(buffer);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPlayerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlayerDto | undefined> {
    const player = await this.playersService.getPlayerById(id);
    console.log(`Fetching player  ${player}`);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }

    return new PlayerDto(player);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPlayer(@Body() createDto: CreatePlayerDto): Promise<PlayerDto> {
    const player = await this.playersService.createPlayer(createDto);
    return new PlayerDto(player);
  }

  @Put(':id')
  async updatePlayer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePlayerDto,
  ): Promise<PlayerDto> {
    const player = await this.playersService.updatePlayer(id, updateDto);
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found.`);
    }
    return new PlayerDto(player);
  }
}
