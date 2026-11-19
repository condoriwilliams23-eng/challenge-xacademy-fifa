import { Repository, Like } from 'typeorm';
import { Player } from '../../entities/player.entity';
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { PlayerDto } from './player.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryPlayerDto } from '../../dto/query-player.dto';
import { CreatePlayerDto } from '../../dto/create-player.dto';
import { UpdatePlayerDto } from '../../dto/update-player.dto';

@Injectable()
export class TypeOrmPlayerRepository implements IPlayerRepository {
  constructor(
    @InjectRepository(PlayerDto)
    private readonly playerRepository: Repository<PlayerDto>,
  ) {}

  async findAll(): Promise<Player[]> {
    const playerDtoList = await this.playerRepository.find();
    const playerList = playerDtoList.map((x) => this.mapToEntity(x));
    return playerList;
  }

  async findPaginated(query: QueryPlayerDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.name) where.longName = Like(`%${query.name}%`);
    if (query.club) where.clubName = Like(`%${query.club}%`);
    if (query.position) where.playerPositions = Like(`%${query.position}%`);

    const [rows, count] = await this.playerRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      players: rows.map((x) => this.mapToEntity(x)),
    };
  }

  async findAllFiltered(query: QueryPlayerDto): Promise<Player[]> {
    const where: any = {};
    if (query.name) where.longName = Like(`%${query.name}%`);
    if (query.club) where.clubName = Like(`%${query.club}%`);
    if (query.position) where.playerPositions = Like(`%${query.position}%`);

    const rows = await this.playerRepository.find({
      where,
      take: 500,
    });

    return rows.map((x) => this.mapToEntity(x));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const dto = await this.playerRepository.findOne({ where: { id } });
    if (dto === null) {
      return undefined;
    }

    const entity = this.mapToEntity(dto);

    return entity;
  }

  async create(createDto: CreatePlayerDto): Promise<Player> {
    const entity = this.playerRepository.create({
      longName: createDto.name,
      clubName: createDto.club,
      playerPositions: createDto.position,
      nationalityName: createDto.nationality,
      overall: createDto.rating,
      potential: createDto.rating,
      pace: createDto.speed,
      shooting: createDto.shooting,
      passing: createDto.passing,
      dribbling: createDto.dribbling,
      age: 25,
      fifaVersion: '23',
      playerFaceUrl: '',
    } as any);

    const saved = await this.playerRepository.save(entity as any);
    return this.mapToEntity(saved as any);
  }

  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    const entity = await this.playerRepository.findOne({ where: { id } });
    if (!entity) return undefined;

    if (updateDto.name !== undefined) entity.longName = updateDto.name;
    if (updateDto.club !== undefined) entity.clubName = updateDto.club;
    if (updateDto.position !== undefined) entity.playerPositions = updateDto.position;
    if (updateDto.nationality !== undefined) entity.nationalityName = updateDto.nationality;
    if (updateDto.rating !== undefined) entity.overall = updateDto.rating;
    if (updateDto.speed !== undefined) entity.pace = updateDto.speed;
    if (updateDto.shooting !== undefined) entity.shooting = updateDto.shooting;
    if (updateDto.passing !== undefined) entity.passing = updateDto.passing;
    if (updateDto.dribbling !== undefined) entity.dribbling = updateDto.dribbling;

    const saved = await this.playerRepository.save(entity as any);
    return this.mapToEntity(saved as any);
  }

  private mapToEntity(playerDto: PlayerDto): Player {
    const player = new Player();
    player.id = playerDto.id;
    player.name = playerDto.longName;
    player.club = playerDto.clubName || 'Unknown Club';
    player.position = playerDto.playerPositions.split(',')[0].trim();
    player.nationality = playerDto.nationalityName || 'Unknown Nationality';
    player.rating = playerDto.overall;
    player.speed = playerDto.pace ?? 0; // Using nullish coalescing operator (??) for numeric defaults
    player.shooting = playerDto.shooting ?? 0;
    player.dribbling = playerDto.dribbling ?? 0;
    player.passing = playerDto.passing ?? 0;

    return player;
  }
}
