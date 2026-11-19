// src/app/services/player.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Player {
  id: number;
  name: string;
  club: string;
  position: string;
  nationality: string;
  rating: number;
  speed: number;
  shooting: number;
  dribbling: number;
  passing: number;
}

export interface PaginatedPlayers {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  data: Player[];
}

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private baseUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  getPlayers(page = 1, limit = 10, name = '', club = '', position = ''): Observable<PaginatedPlayers> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);

    if (name) params = params.set('name', name);
    if (club) params = params.set('club', club);
    if (position) params = params.set('position', position);

    return this.http.get<PaginatedPlayers>(this.baseUrl, { params });
  }

  getPlayer(id: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}/${id}`);
  }

  createPlayer(player: Partial<Player>): Observable<Player> {
    return this.http.post<Player>(this.baseUrl, player);
  }

  updatePlayer(id: number, player: Partial<Player>): Observable<Player> {
    return this.http.put<Player>(`${this.baseUrl}/${id}`, player);
  }

  downloadCsv(name = '', club = '', position = ''): Observable<Blob> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (club) params = params.set('club', club);
    if (position) params = params.set('position', position);

    return this.http.get(`${this.baseUrl}/export/csv`, {
      params,
      responseType: 'blob',
    });
  }
}
