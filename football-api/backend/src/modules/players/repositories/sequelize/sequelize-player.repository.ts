import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { PlayerModel } from './player.model'; // Sequelize model
import { IPlayerRepository } from '../../interfaces/player-repository.interface';
import { Player } from '../../entities/player.entity';
import { QueryPlayerDto } from '../../dto/query-player.dto';
import { CreatePlayerDto } from '../../dto/create-player.dto';
import { UpdatePlayerDto } from '../../dto/update-player.dto';

@Injectable()
export class SequelizePlayerRepository implements IPlayerRepository {
  constructor(
    @InjectModel(PlayerModel)
    private readonly playerModel: typeof PlayerModel,
  ) {}

  async findAll(): Promise<Player[]> {
    const playerList = await this.playerModel.findAll();
    return playerList.map((x) => this.mapToEntity(x));
  }

  async findPaginated(query: QueryPlayerDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    const where: any = {};
    if (query.name) where.longName = { [Op.like]: `%${query.name}%` };
    if (query.club) where.clubName = { [Op.like]: `%${query.club}%` };
    if (query.position) where.playerPositions = { [Op.like]: `%${query.position}%` };

    const { count, rows } = await this.playerModel.findAndCountAll({
      where,
      limit,
      offset,
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
    if (query.name) where.longName = { [Op.like]: `%${query.name}%` };
    if (query.club) where.clubName = { [Op.like]: `%${query.club}%` };
    if (query.position) where.playerPositions = { [Op.like]: `%${query.position}%` };

    const rows = await this.playerModel.findAll({
      where,
      limit: 500,
    });
    return rows.map((x) => this.mapToEntity(x));
  }

  async findOneById(id: number): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }
    return this.mapToEntity(model);
  }

  async create(createDto: CreatePlayerDto): Promise<Player> {
    const model = await this.playerModel.create({
      longName: createDto.name,
      clubName: createDto.club,
      playerPositions: createDto.position,
      nationalityName: createDto.nationality,
      overall: createDto.rating,
      potential: createDto.rating,
      pace: createDto.speed,
      shooting: createDto.shooting,
      dribbling: createDto.dribbling,
      passing: createDto.passing,
      age: 25,
      fifaVersion: '23',
      fifaUpdate: '2',
      playerFaceUrl: '',
    } as any);

    return this.mapToEntity(model);
  }

  async update(id: number, updateDto: UpdatePlayerDto): Promise<Player | undefined> {
    const model = await this.playerModel.findByPk(id);
    if (!model) {
      return undefined;
    }

    await model.update({
      longName: updateDto.name ?? model.longName,
      clubName: updateDto.club ?? model.clubName,
      playerPositions: updateDto.position ?? model.playerPositions,
      nationalityName: updateDto.nationality ?? model.nationalityName,
      overall: updateDto.rating ?? model.overall,
      pace: updateDto.speed ?? model.pace,
      shooting: updateDto.shooting ?? model.shooting,
      dribbling: updateDto.dribbling ?? model.dribbling,
      passing: updateDto.passing ?? model.passing,
    });

    return this.mapToEntity(model);
  }

  private mapToEntity(model: PlayerModel): Player {
    console.log('Mapping PlayerModel to Player entity:', model);
    if (!model) {
      throw new Error('Attempted to map null model to Player entity');
    }
    const player = new Player();
    player.id = model.id;
    player.name = model.longName;
    player.club = model.clubName || 'Unknown Club';
    player.position = model.playerPositions?.split(',')[0].trim() ?? 'Unknown';
    player.nationality = model.nationalityName || 'Unknown Nationality';
    player.rating = model.overall;
    player.speed = model.pace ?? 0;
    player.shooting = model.shooting ?? 0;
    player.dribbling = model.dribbling ?? 0;
    player.passing = model.passing ?? 0;

    return player;
  }
}
