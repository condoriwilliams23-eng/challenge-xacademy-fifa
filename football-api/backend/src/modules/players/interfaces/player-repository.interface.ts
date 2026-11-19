import { Player } from '../entities/player.entity';
import { QueryPlayerDto } from '../dto/query-player.dto';
import { CreatePlayerDto } from '../dto/create-player.dto';
import { UpdatePlayerDto } from '../dto/update-player.dto';

export interface IPlayerRepository {
  findAll(): Promise<Player[]>;
  findPaginated(
    query: QueryPlayerDto,
  ): Promise<{ total: number; page: number; limit: number; totalPages: number; players: Player[] }>;
  findAllFiltered(query: QueryPlayerDto): Promise<Player[]>;
  findOneById(id: number): Promise<Player | undefined>;
  create(createDto: CreatePlayerDto): Promise<Player>;
  update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined>;
}
