import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlayerService, Player } from '../../services/player/player';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css'],
})
export class PlayerListComponent implements OnInit {
  players: Player[] = [];
  page = 1;
  limit = 10;
  totalPages = 1;
  total = 0;

  nameFilter = '';
  clubFilter = '';
  positionFilter = '';

  constructor(private playerService: PlayerService) {}

  ngOnInit() {
    this.loadPlayers();
  }

  loadPlayers() {
    this.playerService
      .getPlayers(this.page, this.limit, this.nameFilter, this.clubFilter, this.positionFilter)
      .subscribe({
        next: (res) => {
          this.players = res.data;
          this.total = res.total;
          this.totalPages = res.totalPages || 1;
        },
        error: (err) => console.error('Error cargando jugadores', err),
      });
  }

  search() {
    this.page = 1;
    this.loadPlayers();
  }

  clearFilters() {
    this.nameFilter = '';
    this.clubFilter = '';
    this.positionFilter = '';
    this.page = 1;
    this.loadPlayers();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadPlayers();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadPlayers();
    }
  }

  exportCsv() {
    this.playerService
      .downloadCsv(this.nameFilter, this.clubFilter, this.positionFilter)
      .subscribe((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'players.csv';
        a.click();
      });
  }
}
