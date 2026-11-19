import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { QueryPlayerDto } from '../../dto/query-player.dto';
import { CreatePlayerDto } from '../../dto/create-player.dto';
import { UpdatePlayerDto } from '../../dto/update-player.dto';

export class InMemoryPlayerRepository implements IPlayerRepository {
  private players: Player[] = [];

  async findAll(): Promise<Player[]> {
    return Promise.resolve([...this.players]);
  }

  async findPaginated(
    query: QueryPlayerDto,
  ): Promise<{ total: number; page: number; limit: number; totalPages: number; players: Player[] }> {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const filtered = await this.findAllFiltered(query);
    const start = (page - 1) * limit;
    return {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
      players: filtered.slice(start, start + limit),
    };
  }

  async findAllFiltered(query: QueryPlayerDto): Promise<Player[]> {
    return this.players.filter((p) => {
      if (query.name && !p.name.toLowerCase().includes(query.name.toLowerCase())) return false;
      if (query.club && !p.club.toLowerCase().includes(query.club.toLowerCase())) return false;
      if (query.position && !p.position.toLowerCase().includes(query.position.toLowerCase())) return false;
      return true;
    });
  }

  async findOneById(id: number): Promise<Player | undefined> {
    return Promise.resolve(this.players.find((p) => p.id === id));
  }

  async create(createDto: CreatePlayerDto): Promise<Player> {
    const player = new Player();
    player.id = this.players.length + 1;
    Object.assign(player, createDto);
    this.players.push(player);
    return player;
  }

  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    const player = this.players.find((p) => p.id === id);
    if (!player) return undefined;
    Object.assign(player, updateDto);
    return player;
  }
}
