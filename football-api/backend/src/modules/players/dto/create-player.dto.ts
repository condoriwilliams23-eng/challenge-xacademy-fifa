import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreatePlayerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  club: string;

  @IsNotEmpty()
  @IsString()
  position: string;

  @IsNotEmpty()
  @IsString()
  nationality: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  rating: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  speed: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  shooting: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  dribbling: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  passing: number;
}
