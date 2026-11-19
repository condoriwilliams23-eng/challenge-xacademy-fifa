import { Inject, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { IPlayerRepository } from './interfaces/player-repository.interface';
import { Player } from './entities/player.entity';
import { QueryPlayerDto } from './dto/query-player.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';

@Injectable()
export class PlayersService {
  constructor(
    @Inject('IPlayerRepository')
    private readonly playerRepository: IPlayerRepository,
  ) {}

  getPlayers(query: QueryPlayerDto) {
    return this.playerRepository.findPaginated(query);
  }

  getPlayerById(id: number): Promise<Player | undefined> {
    return this.playerRepository.findOneById(id);
  }

  createPlayer(createDto: CreatePlayerDto): Promise<Player> {
    return this.playerRepository.create(createDto);
  }

  updatePlayer(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    return this.playerRepository.update(id, updateDto);
  }

  async exportPlayersCsv(query: QueryPlayerDto): Promise<Buffer> {
    const players = await this.playerRepository.findAllFiltered(query);
    const worksheet = XLSX.utils.json_to_sheet(players);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    return Buffer.from(csv, 'utf-8');
  }
}
